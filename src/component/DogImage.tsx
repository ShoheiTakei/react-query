import { useQuery } from "@tanstack/react-query"

type Dog = {
  message: string
  status: string
}

export const DogImage = () => {
  // NOTE: https://tanstack.com/query/latest/docs/framework/react/guides/queries
  const { isPending, error, data, isFetching } = useQuery<Dog>({
    queryKey: ['dogImage'],
    // refetchOnWindowFocus: ウィンドウがフォーカスされたときにクエリを再フェッチするかどうかを制御する。
    // デフォルトではtrueで、ウィンドウがフォーカスされたときにクエリが再フェッチされる
    // refetchOnWindowFocus: false,
    // staleTime: キャッシュが古くなるまでの時間をミリ秒単位で指定可能。
    // デフォルトだと0で、キャッシュが常に新しいデータを返す。
    staleTime: 1000 * 10,
    // gcTime: ガベージコレクションが実行されるまでの時間。
    gcTime: 1000 * 1,
    queryFn: async () => {
      const response = await fetch(
        'https://dog.ceo/api/breeds/image/random',
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
  })

  if (isFetching) {
    // どのような状態でも、クエリがいつでもフェッチ中の場合 (バックグラウンドの再フェッチを含む)、isFetching はtrueになります。
    return <div>データ取得開始！</div>
  }


  if (isPending) {
    // クエリにはまだデータがありません
    return <div>取得中...</div>
  }

  if (error) {
    // クエリでエラーが発生しました
    return <div>取得に失敗しました</div>
  }

  // ここの処理実行 = dataが存在する時
  // データはdataプロパティを介して利用できます。
  return (
    <div className="justify-content: center">
      <h1>犬の画像</h1>
      <img src={data.message} alt="dog image" />
    </div>
  )
}