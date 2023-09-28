import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Connect' })

export default function Connect() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Connect
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Get in touch with me</p>
          <div>
            <form>
              Fields
              <input type="text"></input>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
