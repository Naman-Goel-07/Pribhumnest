import logo from "../../assets/watsapp.png";
const Watsapp = () => {
  return (
    <div className="fixed z-60 bottom-2 right-4 cursor-pointer">
      <a
                href="https://api.whatsapp.com/send/?phone=917303847437&text=Hello+I+am+interested+in+your+PG&type=phone_number&app_absent=0"

        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={logo} alt="" className="w-17 h-17 " />
      </a>
    </div>
  );
};

export default Watsapp;
