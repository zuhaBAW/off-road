import { Group, Image, Container, Anchor } from "@mantine/core";
import Logo from "../../assets/logo.png";

function Navbar() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "white",
        borderBottom: "1px solid #eee",
      }}
    >
      <Container size="lg">
        <Group justify="center" py="md">
          {" "}
          {/* ✅ Centers everything */}
          {/* Logo */}
          <Image
            src={Logo}
            alt="Event Logo"
            height={40}
            width={40}
            fit="contain"
            radius="md"
          />
          {/* Navigation links */}
          <Group gap="lg">
            <Anchor href="/" size="sm" underline="never">
              Home
            </Anchor>
            <Anchor href="/about" size="sm" underline="never">
              About
            </Anchor>
            <Anchor href="/events" size="sm" underline="never">
              Events
            </Anchor>
            <Anchor href="/contact" size="sm" underline="never">
              Contact
            </Anchor>
          </Group>
        </Group>
      </Container>
    </div>
  );
}

export default Navbar;
