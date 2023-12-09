import BellSvg from '@/components/Svg/Bell';

function BellButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`relative min-w-[32px] w-[32px] h-[32px] flex justify-center z-4 items-center rounded-full bg-white focus:outline-none border border-gray-300 hover:border-gray-600`}
    >
      <BellSvg />
    </button>
  );
}

export default BellButton;
