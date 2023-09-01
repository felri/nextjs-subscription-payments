import { BsCash, BsFillCreditCard2BackFill, BsFillCreditCardFill } from 'react-icons/bs';
import { MdPix } from 'react-icons/md';

export const Debit = ({ className = '', ...props }) => (
  <BsFillCreditCard2BackFill className={`text-pink-700 ${className}`} {...props} />
);

export const Credit = ({ className = '', ...props }) => (
  <BsFillCreditCardFill className={`text-pink-700 ${className}`} {...props} />
);

export const Pix = ({ className = '', ...props }) => (
  <MdPix className={`text-pink-700 ${className}`} {...props} />
);

export const Cash = ({ className = '', ...props }) => (
  <BsCash className={`text-pink-700 ${className}`} {...props} />
);
