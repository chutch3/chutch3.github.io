import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { siteConfig } from '@/config/site.config';

const socialLinks = [
  {
    icon: FaGithub,
    href: `https://github.com/${siteConfig.social.github}`,
    label: 'GitHub',
  },
  {
    icon: FaLinkedin,
    href: `https://linkedin.com/in/${siteConfig.social.linkedin}`,
    label: 'LinkedIn',
  },
  {
    icon: FaInstagram,
    href: `https://instagram.com/${siteConfig.social.instagram}`,
    label: 'Instagram',
  },
  {
    icon: FaEnvelope,
    href: `mailto:${siteConfig.social.email}`,
    label: 'Email',
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-cyber-border">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-cyber-muted text-xs font-mono">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div className="flex items-center gap-5">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-cyber-muted hover:text-cyber-cyan transition-colors duration-300"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
