import { supabase } from "../conection";

export const inviteUser = async (email: string, role: string) => {
    const redirectTo = `${window.location.origin}/accept-invite`;
    const { data, error } = await supabase.functions.invoke("invite-user", {
        body: { email, role, redirectTo },
    });
    return { data, error };
};