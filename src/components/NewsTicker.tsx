"use client";

// We define the type for the props that this component will receive
interface NewsTickerProps {
  text: string;
}

// The component now accepts a 'text' prop
export default function NewsTicker({ text }: NewsTickerProps) {
  // We will repeat the text to make the scrolling seamless
  const repeatedText = `${text} • ${text} • ${text} • ${text} • `;

  return (
    <div>
      {/* شريط برتقالي علوي */}
      <div style={{height: '2px', backgroundColor: '#E67514'}}></div>
      
      {/* شريط الأخبار */}
      <div 
        className="py-2 text-white position-relative overflow-hidden"
        style={{backgroundColor: '#212121'}}
      >
        <div className="news-ticker-container">
          <div className="news-ticker-text">
            {/* We are now using the dynamic text from the database */}
            {repeatedText}
          </div>
        </div>
      </div>
      
      {/* شريط برتقالي سفلي */}
      <div style={{height: '4px', backgroundColor: '#E67514'}}></div>
      
      {/* شريط أسود نهائي */}
      <div style={{height: '2px', backgroundColor: '#212121'}}></div>

      <style jsx>{`
  .news-ticker-container {
    width: 100%;
    white-space: nowrap;
  }
  
  .news-ticker-text {
    display: inline-block;
    /* Use the new animation name */
    animation: scroll-ltr 90s linear infinite;
    /* Start the animation from the left edge */
    padding-left: 100%; 
  }
  
  /* Define the new animation keyframes */
  @keyframes scroll-ltr {
    0% {
      /* Start from off-screen to the left */
      transform: translateX(-100%);
    }
    100% {
      /* End off-screen to the right */
      transform: translateX(100%);
    }
  }
`}</style>

    </div>
  );
}
