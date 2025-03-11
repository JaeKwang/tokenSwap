import { useNavigate } from "react-router-dom";
import { MenuItem } from "./ui/menu";

interface MenuButtonProps {
    name: string;
    href: string;
}

function MenuButton({name, href} : MenuButtonProps) {
    const navigate = useNavigate();
    const navigatePage = () => {
        navigate(href);
    };

    return (
        <MenuItem
            value={name}
            _hover={{
                bgColor: "purple.100"
            }}
            onClick={navigatePage}
        >
            {name}
        </MenuItem>
    );
    }

export default MenuButton;