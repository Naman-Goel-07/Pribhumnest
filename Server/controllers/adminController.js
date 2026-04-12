import { adminClient } from "../supabase/client.js";

/**
 * GET /api/user/allUsers
 * Admin: returns all user profiles from the profiles table.
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { data: users, error } = await adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/user/update-role/:id
 * Admin: updates a user's role in the profiles table.
 * Valid roles: 'user', 'admin', 'pg_owner'
 */
export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["user", "admin", "pg_owner"];
    if (!role || !validRoles.includes(role)) {
      return res
        .status(400)
        .json({ message: `Role must be one of: ${validRoles.join(", ")}` });
    }

    const { data: updatedUser, error } = await adminClient
      .from("profiles")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({
      message: `Role updated to '${role}' successfully`,
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/user/delete-user/:id
 * Admin: permanently deletes a user from Supabase Auth AND profiles table.
 * Cascade deletes handle properties and enquiries via FK constraints.
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own admin account" });
    }

    // Delete from Supabase Auth (cascades to profiles via DB trigger)
    const { error } = await adminClient.auth.admin.deleteUser(id);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/user/admin/all-enquiries
 * Admin: returns all enquiries across all properties with property details.
 */
export const getAllEnquiries = async (req, res, next) => {
  try {
    const { data, error } = await adminClient
      .from("enquiries")
      .select(`
        *,
        properties ( title, locality, city ),
        profiles ( name, email )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/user/admin/all-properties
 * Admin: returns ALL properties (including inactive) with owner info.
 */
export const adminGetAllProperties = async (req, res, next) => {
  try {
    const { data, error } = await adminClient
      .from("properties")
      .select(`
        *,
        profiles ( name, email, contact ),
        property_images ( image_url, display_order )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
