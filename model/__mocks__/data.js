const contacts = [
  {
    _id: "6089aed7d4ad2f2a8cb9f49b",
    favorite: true,
    name: "olia",
    phone: "455-88-55",
    email: "kolia@gmail.com",
    owner: "60905bec49fc3324f0019f16",
  },

  {
    _id: "6089aeac68c3cd1a74991a3a",
    favorite: false,
    name: "Kolia",
    phone: "455-88-79",
    email: "kolia@gmail.com",
    owner: "60905bec49fc3324f0019f16",
  },
];

const newContact = {
  _id: "6089af4ed4ad2f2a8cb9f49e",
  favorite: false,
  name: "Test",
  phone: "455-88-79",
  email: "kolia@gmail.com",
  owner: "60905bec49fc3324f0019f16",
};

const User = {
  _id: "60905bec49fc3324f0019f16",
  id: "60905bec49fc3324f0019f16",
  subscription: "starter",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTA1YmVjNDlmYzMzMjRmMDAxOWYxNiIsImlhdCI6MTYyMDg0NjEyOCwiZXhwIjoxNjIwODUzMzI4fQ.TwXGX0G5cJ1TMT1YjZuuYtNmz1dG5uH1GShMNWa26bU",
  email: "Test@gmail.com",
  password: "$2a$06$JJJ5B6cApPAEpuEMlYM9UOUeIaG37z/30XyJmKeikdty6beLoyXfW",
  createdAt: "2021-05-03T23:24:12.307+03:00",
  updatedAt: "2021-05-12T22:50:16.268+03:00",
  __v: 0,
  avatarURL:
    "https://res.cloudinary.com/dk5d9lpyy/image/upload/v1620846364/Avatars/bspitgf9tnl02clxjp2v.jpg",
  idCloudAvatar: "Avatars/bspitgf9tnl02clxjp2v",
};

const users = [];

users[0] = User;

const newUser = { email: "test@test.com", password: "123456" };

module.exports = { contacts, newContact, User, users, newUser };
