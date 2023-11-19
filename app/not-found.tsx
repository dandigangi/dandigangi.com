import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="space-x-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:border-r md:px-6 md:text-8xl md:leading-14">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <h2 className="text-3xl mb-6 leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Oops...
        </h2>
        <p className="mb-14 text-xl leading-normal md:text-2xl">
          This page doesn't seem to be here right now. I'll pretend to check the error logs and fix
          it.
        </p>
        <Link
          href="/"
          className="focus:shadow-outline-blue inline rounded-lg border border-transparent bg-violet-600 px-8 py-2 text-lg font-medium leading-5 text-white shadow transition-colors duration-150 hover:bg-blue-700 focus:outline-none dark:hover:bg-violet-700"
        >
          Take me home, country roads
        </Link>
      </div>
    </div>
  )
}
