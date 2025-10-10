import React from "react";
import { ActionIcon } from "@mantine/core";
import instagram from "../../assets/icons/instagram.svg";
import facebook from "../../assets/icons/facebook.svg";
import whatsapp from "../../assets/icons/whatsapp.svg"


export default function SocialBar(isLoggedIn) {
  const isLoggedInCheck = Boolean(localStorage.getItem("user"));
  console.log(isLoggedIn);
  // window.location.reload();
  const items = [
    {
      href: "https://www.instagram.com/offroadadda/?utm_source=qr&igsh=bDEza3Bmc2gyNjhl#",
      label: "Instagram",
      src: instagram,
    },
    {
      href: "http://www.facebook.com/share/1WTny8ACun/",
      label: "Facebook",
      src: facebook,
    },
  ];
  if (isLoggedInCheck) {
    items.push({
      href: "https://chat.whatsapp.com/ITulSmcpxnGFFGKNAbsOvN", // replace with your actual group link",
      label: "WhatsApp",
      src: whatsapp,
    });
  }
  return (
    <div className="home-social" role="contentinfo" aria-label="Social links">
      {items.map((i) => (
        <a
          key={i.label}
          className="social-link"
          href={i.href}
          target="_blank"
          rel="noreferrer"
        >
          <ActionIcon
            variant="transparent" // no bg or border
            radius="xl"
            size="xl" // clean circular icon area
            className="social-action"
            aria-label={i.label}
          >
            <img src={i.src} alt={i.label} className="social-icon" />
          </ActionIcon>
          {/* <span className="social-text">{i.label}</span> */}
        </a>
      ))}
    </div>
  );
}
