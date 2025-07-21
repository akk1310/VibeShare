import { FaLinkedin, FaEnvelope, FaGithub,FaEnvelopeSquare } from "react-icons/fa";

function ContactCard() {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#1A1A1A] border border-gray-600 w-full max-w-xs text-white shadow-lg">
      <a
        target="_blank"
        href="https://www.linkedin.com/in/adnankundlik/"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:text-purple-400 transition"
      >
        <FaLinkedin size={20} />
        LinkedIn
      </a>
      
      <div className="flex items-center gap-2">
        <a 
        target="_blank"
        href="https://github.com/akk1310"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:text-purple-400 transition"

        >
        <FaGithub size={20} />
        <span>Github</span>
        </a>

      </div>
      <div className="flex items-center gap-2">
        {/* <FaEnvelopeSquare size={10} /> */}
        <span className="text-xs text-purple-300 flex gap-1 justify-centers items-center"> <span className="text-sm">📩</span> kundlikadnan64@gmail.com</span>
      </div>
    </div>
  );
}

export default ContactCard;
