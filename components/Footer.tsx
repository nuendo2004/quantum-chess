const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-20">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <h5 className="text-lg font-bold mb-4">QuantumPlay</h5>
          <div className="flex gap-4">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-full">
              Start Playing!
            </button>
          </div>
        </div>
        <div>
          <h6 className="font-semibold mb-4">Game Hub</h6>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/games" className="hover:text-white">
                All Games
              </a>
            </li>
            <li>
              <a href="/leaderboard" className="hover:text-white">
                Leaderboards
              </a>
            </li>
            <li>
              <a href="/achievements" className="hover:text-white">
                Achievements
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="font-semibold mb-4">Learning</h6>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/learn" className="hover:text-white">
                Guides
              </a>
            </li>
            <li>
              <a href="/videos" className="hover:text-white">
                Video Tutorials
              </a>
            </li>
            <li>
              <a href="/glossary" className="hover:text-white">
                Quantum Glossary
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="font-semibold mb-4">Community</h6>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-white">
              Discord
            </a>
            <a href="#" className="hover:text-white">
              Tournaments
            </a>
            <a href="#" className="hover:text-white">
              Blog
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-gray-400">
        © 2023 QuantumPlay. For science, for fun!
      </div>
    </footer>
  );
};

export default Footer;
