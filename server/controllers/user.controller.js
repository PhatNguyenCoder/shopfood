const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: message });
  }
};

// đăng ký user
exports.postUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role = 0 } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      phone: phone,
      role: role,
    });

    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

// login user
exports.loginUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(500)
        .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
    }

    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res
        .status(500)
        .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, "secret", {
      expiresIn: "10s",
    });

    res.status(200).json({
      message: "Đăng nhập thành công",
      token: token,
      _id: user._id,
      phone: user.phone,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// login admin
exports.loginToken = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(500)
        .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
    }

    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res
        .status(500)
        .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
    }

    if (user.role !== 1) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập trang quản trị admin" });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, "secret", {
      expiresIn: "23h",
    });

    res.status(200).json({ message: "Đăng nhập thành công", token: token });
  } catch (error) {
    res.status(500).send(error);
  }
};
