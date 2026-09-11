export function BrandLogo() {
  return (
    <a
      href="https://uniacco.com"
      target="_blank"
      rel="noopener noreferrer"
      className="mb-6 flex justify-center"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://uniacco.imgix.net/site-static/v2/uniacco/logo_full.svg"
        alt="UniAcco"
        className="h-6 w-auto"
      />
    </a>
  );
}
