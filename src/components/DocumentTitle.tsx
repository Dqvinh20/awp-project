import { Helmet } from 'react-helmet';

interface DocumentTitleProps {
  title: string;
}
function DocumentTitle({ title }: DocumentTitleProps) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

export default DocumentTitle;
