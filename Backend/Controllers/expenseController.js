const path = require("path");
const expenseData = require("../Model/expenseModel");
const userDB = require("../Model/userModel");
const yearlyReportDb = require("../Model/yearlyReaportModel");
const XLSX = require("xlsx");
const { uploadToS3 } = require("../Services/S3Services");
const UrlDb = require("../Model/fileDownloadUrlModel");

exports.mainHome = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "Frontend", "Views", "homeAfterLogin.html")
  );
};

exports.getExpense = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "Frontend", "Views", "expense.html")
  );
};

exports.addExpense = async (req, res) => {
  const body = req.body;
  const id = req.user._id;
  const expenseAmount = parseInt(body.ExpenseAmount);
  const description = body.ExpenseDesc;
  const expenseType = body.ExpenseType;
  const date = formatDate(new Date().toLocaleDateString());
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const formattedDate = `${currentMonth
    .toString()
    .padStart(2, "0")}-${currentYear}`;
  try {
    const result = await userDB.findById(id);
    const Yearlyresult = await yearlyReportDb.find({
      userId: id,
      year: formattedDate.toString(),
    });
    const totalExpense = parseInt(result.totalExpense);
    let MonthlyTotalExpense = 0;
    if (Yearlyresult.length > 0) {
      MonthlyTotalExpense = parseInt(Yearlyresult[0].TotalExpense);
    }
    const ExpenseData = new expenseData({
      expenseAmount: expenseAmount,
      date: date,
      description: description,
      expenseType: expenseType,
      userId: id,
    });
    await ExpenseData.save();

    if (Yearlyresult && Yearlyresult.length > 0) {
      if (Yearlyresult[0].year == formattedDate) {
        await yearlyReportDb.updateOne(
          { userId: id, year: formattedDate },
          { TotalExpense: MonthlyTotalExpense + expenseAmount }
        );
      }
    } else {
      const YearlyReport = new yearlyReportDb({
        year: formattedDate,
        TotalExpense: expenseAmount,
        userId: id,
      });
      YearlyReport.save();
    }
    await userDB.updateOne(
      { _id: id },
      { date: date, totalExpense: totalExpense + expenseAmount }
    );

    res.status(201).json({ data: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "error" });
  }
};

exports.getExpensePage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "Frontend", "Views", "viewExpense.html")
  );
};

exports.getExpenseData = async (req, res) => {
  const limit = +req.query.rows || 5;
  let totalItems;
  try {
    const page = +req.query.page || 1;
    const id = req.user._id;
    totalItems = await expenseData.countDocuments({ userId: id });
    const result = await expenseData
      .find({ userId: id })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    res.json({
      result,
      currentPage: page,
      hasNextPage: limit * page < totalItems,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res.status(500).json({ data: "error" });
    console.log(error);
  }
};

exports.deleteExpenseData = async (req, res) => {
  const date = formatDate(new Date().toLocaleDateString());
  try {
    const id = req.body.id;
    const userid = req.user._id;
    const expenseAmount = parseInt(req.body.ExpenseAmount);
    console.log(expenseAmount);
    const moneyDataRecord = await expenseData.findOne({
      _id: id,
      userId: userid,
    });
    const dataFromTb = moneyDataRecord.date;
    const parts = dataFromTb.split("/");
    const month = parts[1];
    const year = parts[2];
    const formattedDate = `${month.toString().padStart(2, "0")}-${year}`;

    const yearlyResult = await yearlyReportDb.findOne({
      userId: userid,
      year: formattedDate,
    });

    if (!yearlyResult) {
      throw new Error(
        "Yearly report not found for the specified month and year."
      );
    }
    const YearlytotalExpense = parseInt(yearlyResult.TotalExpense);
    const result = await userDB.findById(userid);
    const totalExpense = parseInt(result.totalExpense);

    await expenseData.deleteOne({ _id: id, userId: userid });
    await yearlyReportDb.updateOne(
      { userId: userid, year: formattedDate },
      { TotalExpense: YearlytotalExpense - expenseAmount }
    );
    await userDB.updateOne(
      { _id: userid },
      { date: date, totalExpense: totalExpense - expenseAmount }
    );

    res.redirect("/expense/viewExpenses");
  } catch (err) {
    res.status(500).json({ data: "error" });
    console.log(err);
  }
};

exports.updateExpense = async (req, res) => {
  const date = formatDate(new Date().toLocaleDateString());
  try {
    const body = req.body;
    const id = body.id;
    const userid = req.user._id;
    const newExpenseAmount = parseInt(body.data.ExpenseAmount);
    const newDescription = body.data.ExpenseDesc;
    const newExpenseType = body.data.ExpenseType;

    const ExpenseData = await expenseData.findOne({
      _id: id,
      userId: userid,
    });

    const oldExpenseAmount = parseInt(ExpenseData.expenseAmount);
    const dataFromTb = ExpenseData.date;
    const parts = dataFromTb.split("/");
    const month = parts[1];
    const year = parts[2];
    const formattedDate = `${month.toString().padStart(2, "0")}-${year}`;

    await ExpenseData.updateOne({
      date: date,
      expenseAmount: parseInt(newExpenseAmount),
      description: newDescription,
      expenseType: newExpenseType,
    });

    const result = await userDB.findById(userid);
    const totalExpense = parseInt(result.totalExpense);
    const expenseAmountDifference = oldExpenseAmount - newExpenseAmount;

    const yearlyResult = await yearlyReportDb.findOne({
      userId: userid,
      year: formattedDate,
    });
    const YearlytotalExpense = parseInt(yearlyResult.TotalExpense);
    const TotalexpenseAmountDifference = parseInt(
      oldExpenseAmount - newExpenseAmount
    );

    await yearlyReportDb.updateOne(
      { userId: userid, year: formattedDate },
      { TotalExpense: YearlytotalExpense - TotalexpenseAmountDifference }
    );
    await userDB.updateOne(
      { _id: userid },
      { date: date, totalExpense: totalExpense - expenseAmountDifference }
    );

    res.status(201).json({ data: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ data: "error" });
  }
};

exports.getLeaderBoardPage = (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "Frontend",
      "Views",
      "expenseLeaderBoard.html"
    )
  );
};

exports.getLeaderBoardData = async (req, res) => {
  try {
    const leaderboardData = await userDB
      .find({})
      .select("name totalExpense")
      .sort()
      .exec();
    res.status(200).json(leaderboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

exports.getViewMonetaryPage = (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "Frontend",
      "Views",
      "viewMonetoryData.html"
    )
  );
};

exports.getYearlyExpensesData = async (req, res) => {
  try {
    const id = req.user._id;
    const result = await yearlyReportDb.find({ userId: id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ data: "error" });
    console.log(err);
  }
};

exports.getDownloadUrl = async (req, res) => {
  try {
    const id = req.user._id;
    const result = await UrlDb.find({ userId: id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ data: "error" });
    console.log(err);
  }
};

exports.downloadExpense = async (req, res) => {
  const userId = req.user._id;
  const date = new Date().toLocaleString().replace(/\//g, "-");
  const { dailyData, weeklyData, monthlyData, yearlyData } = req.body;

  const yearlyDataValues = [
    ["Section", "MonthYear", "Total Expense"],
    ...createDataArrayWithYearlySection("Yearly Data", yearlyData),
  ];
  const allData = [
    ["Section", "Date", "ExpenseAmount", "ExpenseType", "Description"],
    ...createDataArrayWithSection("Daily Data", dailyData),
    ...createDataArrayWithSection("Weekly Data", weeklyData),
    ...createDataArrayWithSection("Monthly Data", monthlyData),
    ...yearlyDataValues,
  ];
  function createDataArrayWithSection(section, data) {
    return data.map((item) => [
      section,
      item.date,
      item.ExpenseAmount,
      item.expenseType,
      item.description,
    ]);
  }

  function createDataArrayWithYearlySection(section, data) {
    return data.map((item) => [section, item.monthYear, item.totalExpense]);
  }
  const worksheet = XLSX.utils.aoa_to_sheet(allData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Combined Data");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  const fileName = `expense${userId}/Report_date-${date}.xlsx`;
  await uploadToS3("expensetracker08", buffer, fileName)
    .then(async (fileUrl) => {
      res.setHeader("Content-Disposition", "attachment; filename=expense.xlsx");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      const UrlData = new UrlDb({
        date: date,
        fileUrl: fileUrl,
        userId: userId,
      });
      await UrlData.save();

      res.status(200).json({ fileUrl, success: true });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to upload file to S3" });
    });
};

module.exports.viewReportExpensesData = async (req, res) => {
  try {
    const id = req.user._id;
    const result = await expenseData.find({ userId: id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ data: "error" });
    console.log(err);
  }
};

function formatDate(currentDate) {
  const [month, day, year] = currentDate.split("/"); // Assuming the date format is MM/DD/YYYY
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
