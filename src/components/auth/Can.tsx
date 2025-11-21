import { usePermissions } from "@/hooks/usePermissions";

type Props = {
    permission: string;
    children: React.ReactNode;
};

export default function Can({ permission, children }: Props) {
    const { can } = usePermissions();
    return can(permission) ? <>{children}</> : null;
}
