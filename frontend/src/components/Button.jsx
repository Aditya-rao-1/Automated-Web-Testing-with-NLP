import clsx from "clsx";
import { Marker } from "./Marker.jsx";

const Button = ({
  icon,
  children,
  href,
  containerClassName,
  onClick,
  markerFill,
}) => {
  const sharedClasses = clsx(
    "relative p-0.5 g5 rounded-2xl shadow-500 group",
    "inline-block no-underline cursor-pointer select-none",
    containerClassName,
  );

  const Inner = () => (
    <>
      <span className="relative flex items-center min-h-[60px] px-4 g4 rounded-2xl inner-before group-hover:before:opacity-100 overflow-hidden">

        {/* Support both string (img src) and React element for icon */}
        {icon &&
          (typeof icon === "string" ? (
            <img
              src={icon}
              alt="icon"
              className="size-10 mr-5 object-contain z-10"
            />
          ) : (
            <span className="size-10 mr-5 flex items-center justify-center z-10">
              {icon}
            </span>
          ))}

        <span className="relative z-2 font-poppins base-bold text-p3 uppercase">
          {children}
        </span>
      </span>

      <span className="glow-before glow-after" />
    </>
  );

  return href ? (
    <a href={href} className={sharedClasses}>
      <Inner />
    </a>
  ) : (
    <button onClick={onClick} className={sharedClasses} type="button">
      <Inner />
    </button>
  );
};


export default Button;

