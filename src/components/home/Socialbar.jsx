import React from "react";
import { ActionIcon } from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

const items = [
  {
    href: "https://www.instagram.com/offroadadda/?utm_source=qr&igsh=bDEza3Bmc2gyNjhl#",
    label: "Instagram",
    Icon: IconBrandInstagram,
  },
  {
    href: "http://www.facebook.com/share/1WTny8ACun/",
    label: "Facebook",
    Icon: IconBrandFacebook,
  },
  // {
  //   href: "#https://chat.whatsapp.com/ITulSmcpxnGFFGKNAbsOvN",
  //   label: "WhatsApp",
  //   Icon: IconBrandWhatsapp,
  // },
];

export default function SocialBar() {
  return (
    <div className="home-social" role="contentinfo" aria-label="Social links">
      {items.map(( i) => (
        <a
          key={i}
          className="social-link"
          href={i.href}
          target="_blank"
          rel="noreferrer"
        >
          <ActionIcon
            variant="outline"
            color="orange"
            radius={'300px'}
            size={10} // circle size (all equal)
            className="social-action" // ring + bg tuning
            aria-label={i.label}
          >
            <i.Icon size={20} stroke={2} radius="xl" /> {/* icon size & weight */}
          </ActionIcon>
          <span className="social-text">{i.label}</span>
        </a>
      ))}
    </div>
  );
}
