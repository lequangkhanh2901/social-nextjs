export default function PostSkeleton() {
  return (
    <div className="bg-common-white mt-5 rounded-lg p-4 ">
      <div className="flex gap-2 items-center">
        <div className="w-9 aspect-square rounded-full bg-common-gray-light"></div>
        <div>
          <div className="w-[100px] bg-common-gray-light rounded h-4"></div>
          <div className="w-[150px] h-3 bg-common-gray-light rounded mt-1"></div>
        </div>
        <div className="ml-auto w-6 aspect-square rounded-full bg-common-gray-light"></div>
      </div>
      <div className="rounded-md bg-common-gray-light mt-2 h-10"></div>
      <div className="flex gap-6 px-5 mt-2">
        <div className="bg-common-gray-light rounded w-full h-6"></div>
        <div className="bg-common-gray-light rounded w-full h-6"></div>
        <div className="bg-common-gray-light rounded w-full h-6"></div>
      </div>
    </div>
  )
}
