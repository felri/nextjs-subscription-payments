const Logo = ({ className = '', ...props }) => (
  
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    version="1"
    viewBox="0 0 300 300"
    {...props}
    className={className}
  >
    <path
      fill="#ff004a"
      d="M143.7 293.9c-5.4-.8-11.9-4.4-15.8-8.6-3.1-3.3-76-129.2-77.7-134.2-.7-1.9-1.2-6.4-1.2-10.1 0-8.3 3.2-15.2 9.6-20.9 8.4-7.4 4.7-7.1 90.4-7.1s82-.3 90.4 7.1c6.4 5.7 9.6 12.6 9.6 20.9 0 3.7-.5 8.2-1.2 10.1-1.9 5.6-74.8 131.2-78.1 134.7-6.2 6.5-16.2 9.6-26 8.1zm8-26.7c.6-.4 4.8-7 9.2-14.6C173.2 231.5 173 231 149 231s-24.2.5-11.9 21.6c8.1 14 9.2 15.4 11.9 15.4.8 0 2-.4 2.7-.8zm-26.5-47.9c2.2-2.6 16.8-28.7 16.8-30.1 0-.7-.9-2.1-2-3.2-1.8-1.8-3.3-2-18.3-2-17.5 0-20.7.8-20.7 5.2 0 2.1 11.2 22.4 15.7 28.6 2.7 3.6 6.1 4.2 8.5 1.5zm56.1-1.5c4.5-6.2 15.7-26.5 15.7-28.6 0-4.4-3.2-5.2-20.7-5.2-15 0-16.5.2-18.3 2-1.1 1.1-2 2.5-2 3.2 0 1.4 14.6 27.5 16.8 30.1 2.4 2.7 5.8 2.1 8.5-1.5zm-83.1-45.5c.8-1 5-8 9.2-15.5 11-19.3 10.6-19.8-13.7-19.8-16.4 0-19.7.9-19.7 5.2 0 2 14.2 27.9 16.7 30.4 2 1.9 5.7 1.8 7.5-.3zm62.5-12.8c12.6-21.5 12-22.5-11.7-22.5-17.1 0-20 .8-20 5.6 0 2 12.8 25.7 16.3 30.2.6.7 2.4 1.2 4.1 1 2.8-.3 3.8-1.5 11.3-14.3zm46.6 13.1c2.5-2.5 16.7-28.4 16.7-30.4 0-4.3-3.3-5.2-19.7-5.2-24.3 0-24.7.5-13.7 19.8 4.2 7.5 8.4 14.5 9.2 15.5 1.8 2.1 5.5 2.2 7.5.3z"
    ></path>
    <path
      fill="#00a15c"
      d="M137.5 94.6c-25.2-5.8-43.8-26.7-46.9-52.8L90 37h3.8c9.5.1 23.1 5.2 32.5 12.4L131 53v-5.8c0-12.3 6.1-28.3 14-37.2l4-4.5 4 4.5c7.9 8.9 14 24.9 14 37.2V53l4.7-3.6c9.4-7.2 23-12.3 32.5-12.4h3.8l-.6 4.8c-3.5 29.5-27.1 52.2-55.7 53.7-5 .3-10.5-.1-14.2-.9z"
    ></path>
  </svg>
);

export default Logo;
