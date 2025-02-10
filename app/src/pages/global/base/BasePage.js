export default function BasePage ({theme, page}) {
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: theme.css }}>
            </style>
            <div dangerouslySetInnerHTML={{ __html: theme.navbar }}>
            </div>
                <div dangerouslySetInnerHTML={{ __html: page.html }}>
            </div>
            <div dangerouslySetInnerHTML={{ __html: theme.footer }}>
            </div>
        </>
    )
}