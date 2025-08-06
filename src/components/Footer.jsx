const Footer = () => {
  return (
    <>
      {" "}
      {/* Footer moderne */}
      <footer className="w-full bg-white/80 backdrop-blur border-t border-blue-100 py-6 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2">
          <span className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CV Generator. Hackathon project.
          </span>
          <div className="flex gap-4 text-gray-400 text-xs">
            <a href="#" className="hover:text-blue-600 transition">
              À propos
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              Contact
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
