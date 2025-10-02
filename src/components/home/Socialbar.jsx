import React from "react";
import { ActionIcon } from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

const items = [
  { href: "#", label: "Link", Icon: IconBrandInstagram },
  { href: "#", label: "Link", Icon: IconBrandFacebook },
  { href: "#", label: "Link", Icon: IconBrandWhatsapp },
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
