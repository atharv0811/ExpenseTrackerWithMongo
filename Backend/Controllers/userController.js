const path = require("path");
const userDB = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userDb = require("../Model/userModel");
// var SibApiV3Sdk = require("sib-api-v3-sdk");
// const { v4: uuidv4 } = require("uuid");
// const forgetPasswordModel = require("../Model/forgetPasswordModel");

exports.getRegistrationPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "Frontend", "Views", "register.html")
  );
};

exports.getLoginPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "Frontend", "Views", "login.html")
  );
};

exports.addUser = async (req, res) => {
  const body = req.body;
  const name = body.nameInput;
  const email = body.emailInput;
  const passwordInput = body.passwordInput;
  const date = formatDate(new Date().toLocaleDateString());

  try {
    const password = await bcrypt.hash(passwordInput, 10);
    const user = new userDB({
      date: date,
      name: name,
      email: email,
      password: password,
    });

    await user.save();

    res.status(201).json({ data: "success" });
  } catch (err) {
    console.log(err.code);
    if (err.code == 11000) {
      res.status(409).json({ data: "exist" });
    } else {
      res.status(500).json({ data: "error" });
    }
  }
};

exports.checkLogin = async (req, res) => {
  const body = req.body;
  const email = body.emailInput;
  const password = body.passwordInput;

  try {
    let data = await userDB.findOne({
      email: email,
    });

    if (data) {
      const checkLogin = await bcrypt.compare(password, data.password);
      if (checkLogin) {
        res
          .status(201)
          .json({ data: "success", token: generateAccessToken(data.id) });
      } else {
        res.status(401).json({ data: "Failed" });
      }
    } else {
      res.status(404).json({ data: "notExist" });
    }
  } catch (error) {
    res.status(500).json({ data: "error" });
    console.log(error);
  }
};

exports.getHome = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "Frontend", "Views", "home.html")
  );
};

// exports.SendforgetPasswordLink = async (req, res) => {
//   try {
//     const email = req.body.emailId;
//     const id = uuidv4();
//     const user = await userDB.findOne({
//       where: { email: email },
//       attributes: ["id"],
//     });
//     if (user) {
//       await forgetPasswordModel.create({
//         id: id,
//         userDatumId: user.id,
//       });

//       var defaultClient = SibApiV3Sdk.ApiClient.instance;
//       var apiKey = defaultClient.authentications["api-key"];
//       apiKey.apiKey = process.env.FORGETPASSWORDKEY;
//       var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
//       const sender = { email: "karnekaratharv12@gmail.com" };
//       const receivers = [{ email: `${email}` }];
//       apiInstance
//         .sendTransacEmail({
//           sender,
//           to: receivers,
//           subject: "hello",
//           textContent: `click on given one time link to reset the password: ${process.env.FORGETPASSLINK}/user/forgetPassword/${id}`,
//         })
//         .then(() => {
//           res.status(202).json({ message: "success" });
//         });
//     } else {
//       res.status(404).send();
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send();
//   }
// };

// exports.getForgetPasswordPage = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const response = await forgetPasswordModel.findOne({
//       where: { id: id, isactive: 1 },
//     });
//     if (response) {
//       const t = await sequelize.transaction();
//       try {
//         await response.update({ isactive: 0 }, { transaction: t });
//         await t.commit();
//         res.sendFile(
//           path.join(
//             __dirname,
//             "..",
//             "..",
//             "Frontend",
//             "Views",
//             "forgetPasswordPage.html"
//           )
//         );
//       } catch (error) {
//         await t.rollback();
//         console.log(error);
//         res.status(500).send();
//       }
//     } else {
//       res.status(404).send();
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send();
//   }
// };

// exports.updatePasswordData = async (req, res) => {
//   const id = req.body.id;
//   const password = req.body.password;
//   const date = formatDate(new Date().toLocaleDateString());
//   const t = await sequelize.transaction();
//   try {
//     const response = await forgetPasswordModel.findOne({
//       where: { id: id },
//       attributes: ["userDatumId"],
//       transaction: t,
//     });
//     const userId = response.userDatumId;
//     const passWordHashed = await bcrypt.hash(password, 10);
//     await userDB.update(
//       { date: date, password: passWordHashed },
//       { where: { id: userId }, transaction: t }
//     );
//     await t.commit();
//     res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//     await t.rollback();
//     console.log(error);
//     res.status(500).send();
//   }
// };

function generateAccessToken(id) {
  return jwt.sign({ userid: id }, process.env.SECRETKEY);
}

function formatDate(currentDate) {
  const [month, day, year] = currentDate.split("/");
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
