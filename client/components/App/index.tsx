import { Suspense } from 'react'
import routes from '~react-pages'
import { useRoutes } from 'react-router-dom'
import Loading from './Loading'

function App() {
	return <Suspense fallback={<Loading />}>{useRoutes(routes)}</Suspense>
}

export default App
