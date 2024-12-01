async function fetchUsers() {
    // Fetch all users
    try {
        const response = await fetch("1/users");

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const users = await response.json();
        console.log("Fetched users:", users);
        return users;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

async function addUser(user) {
    // Example of the addUser function
    try {
        const response = await fetch("/users/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                status: response.status,
                error: errorData.error || "Failed to add user",
            };
        }

        const newUser = await response.json();
        return { status: response.status, success: true, user: newUser };
    } catch (error) {
        console.error("There was a problem adding the user:", error);
        return { status: 500, error: "Failed to add user" };
    }
}

async function login(credentials) {
    // Login function
    try {
        const response = await fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                status: response.status,
                error: errorData.error || "Login failed",
            };
        }

        const result = await response.json();
        return { status: response.status, success: true, message: result.message, username: result.username, lastname: result.lastname};
    } catch (error) {
        console.error("There was a problem with the login operation:", error);
        return { status: 500, error: "Login failed" };
    }
}


async function updateUser(name, updatedUser) {
    // Update a user
    try {
        const response = await fetch(`/users/update/${name}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });

        if (!response.ok) {
            throw new Error("Failed to update user");
        }

        const result = await response.json();
        console.log(`Updated user ${name}:`, result);
        return result;
    } catch (error) {
        console.error("There was a problem updating the user:", error);
    }
}

async function deleteUser(name) {
    // Delete a user
    try {
        const response = await fetch(`/users/delete/${name}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete user");
        }

        console.log(`Deleted user ${name}`);
    } catch (error) {
        console.error("There was a problem deleting the user:", error);
    }
}

export { fetchUsers, addUser, login, updateUser, deleteUser };
