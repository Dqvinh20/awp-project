import ClassroomLogo from '../assets/logo_square_rounded.svg';

function BrandLogo() {
  return (
    <div className="p-0">
      <img
        src={ClassroomLogo}
        width={32}
        alt="Brand logo (Education purpose)"
      />
    </div>
  );
}

export default BrandLogo;
