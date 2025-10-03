import UsersService from "../services/users.service.js";

const usersService = new UsersService();

export const createUser = async (req, res) => {
     try {
          const { email, password } = req.body;
          if (!password || !email) {
               return res.status(400).json({ error: "Please provide email and password" });
          }
          const user = await usersService.createUser(email, password);

          res.status(200).send(user);
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to create user" });
     }
}

export const getUsers = async (req, res) => {
     try {
          const users = await usersService.getUsers();
          res.status(200).json(users);
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to fetch users" });
     }
}

export const getUserById = async (req, res) => {
     try {
          const { id } = req.params;
          const user = await usersService.getUserById(id);
          if (!user) {
               return res.status(404).json({ error: "User not found" });
          }
          res.status(200).json(user);
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to fetch user" });
     }
}