type BannerProps = {
  imageUrl?: string;
  height?: string;
  className?: string;
};

export default function Banner({ 
  imageUrl = '/images/sisi-banner.jpg', 
  height = 'auto',
  className = ''
}: BannerProps) {
  return (
    <section 
      className={`position-relative ${className}`}
      style={{
        width: '100%',
        height: height,
        minHeight: '300px',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
    </section>
  );
}
