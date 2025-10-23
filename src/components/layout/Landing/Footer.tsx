import logo from "../../../assets/skillforge-logo.webp";
import { Mail, MapPin, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="px-6 md:px-12 lg:px-18 bg-background"
    >
      <div className="flex flex-col md:flex-row md:justify-between gap-10 py-15">
        <section className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="skillforge" loading="lazy" width={35} />
            <span className="text-lg">SkillForge</span>
          </div>

          <p className="text-muted-foreground mb-4 max-w-[350px]">
            Forge your path. Share your skills. Join a global community of
            leanrers and teachers making knowledge accessible to everyone.
          </p>

          <div className="flex items-center gap-2 text-muted-foreground mb-2 text-sm">
            <Mail size={18} />
            <a href="mailto:ososamuel246@gmail.com">ososamuel246@gmail.com</a>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin size={18} />
            <span>Nigeria</span>
          </div>
        </section>

        {/* Quick Links */}
        <section className="flex flex-col gap-4 text-sm">
          <h3>Quick Links</h3>

          <a
            href="#home"
            className="text-muted-foreground hover:text-primary transition cursor-pointer w-fit"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-muted-foreground hover:text-primary transition cursor-pointer w-fit"
          >
            About
          </a>
          <a
            href="#privacy"
            className="text-muted-foreground hover:text-primary transition cursor-pointer w-fit"
          >
            Privacy
          </a>
          <a
            href="terms"
            className="text-muted-foreground hover:text-primary transition cursor-pointer w-fit"
          >
            Terms
          </a>
        </section>

        {/* Contact */}
        <section className="flex flex-col gap-4">
          <h4 className="text-sm">Connect With Us</h4>

          <div className="flex items-center gap-4 text-primary">
            <motion.a
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95, y: 5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              href="#"
              target="_blank"
              className="p-2.5 border-ring/20 border-1 rounded-radius bg-soft-primary"
            >
              <Mail size={18} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95, y: 5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              href="#"
              target="_blank"
              className="p-2.5 border-ring/20 border-1 rounded-radius bg-soft-primary"
            >
              <Linkedin size={18} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95, y: 5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              href="#"
              target="_blank"
              className="p-2.5 border-ring/20 border-1 rounded-radius bg-soft-primary"
            >
              <Twitter size={18} />
            </motion.a>
          </div>
        </section>
      </div>

      <div className="py-10 flex flex-col md:flex-row md:justify-between items-center gap-4 border-t-1 border-border text-muted-foreground text-sm text-center">
        <p>&copy; {year} SkillForge. All rights reserved.</p>

        <div className="flex gap-6">
          <a
            href="#"
            className="hover:text-primary transition cursor-pointer w-fit"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-primary transition cursor-pointer w-fit"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-primary transition cursor-pointer w-fit"
          >
            Cookies
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
