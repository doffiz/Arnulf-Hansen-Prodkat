import { useRouter } from 'next/router';
import Link from 'next/link';

type BreadcrumbProps = {
  data: any;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ data }) => {
  console.log("breadcrumb data", data)
  const parent = data?.parent;
  const grandparent = parent?.parent;
  const title = data?.title;

  const router = useRouter();
  const pathSegments = router.asPath.split('/').filter(segment => segment);
  const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);

  let breadcrumbItems = ['Hjem'];
  let breadcrumbLinks = ['/'];

  if (pathSegments.length > 1) {
    breadcrumbItems.push(capitalize(pathSegments[0]));
    breadcrumbLinks.push(`/${pathSegments[0].toLowerCase()}`);
  } else if (parent && parent.title && parent.slug) {
    breadcrumbItems.push(parent.title);
    breadcrumbLinks.push(`/${parent.slug.current}`);
  }
  
  if (grandparent && grandparent.title && grandparent.slug) {
    breadcrumbItems.push(grandparent.title);
    breadcrumbLinks.push(`/${grandparent.slug.current}`);
  }

  if (parent && parent.title && parent.slug) {
    breadcrumbItems.push(parent.title);
    breadcrumbLinks.push(`/${parent.slug.current}`);
  }
  
  if (title) {
    breadcrumbItems.push(title);
    breadcrumbLinks.push(router.asPath);
  }
  
  return (
    <div className="bg-[#262626] text-white mx-auto">
      <div className="max-w-[1600px] mx-auto px-12 md:px-12 p-4">
        {breadcrumbItems.map((item, index) => (
          <span key={index}>
            {index !== 0 && <span className="mx-2">»</span>}
            {index !== breadcrumbItems.length - 1 ? (
              <Link href={breadcrumbLinks[index]}>
                {item}
              </Link>
            ) : (
              <label className="font-bold">{item}</label>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Breadcrumb;