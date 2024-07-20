import dynamic from 'next/dynamic'


const Text = dynamic(
    () => import('./text').then(m => m.Text),
    {
        ssr: false,
    },
)

export { Text }
