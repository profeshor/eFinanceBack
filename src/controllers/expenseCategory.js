const ExpenseCategory = require('../models/expenseCategory');

/**
 * Creates account category
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createExpenseCategory = (req, res, next) => {
    const expenseCategory = new ExpenseCategory({
        title: req.body.title,
        icon: req.body.icon,
        color: req.body.color,
        creator: req.userData.userId ? req.userData.userId : null
    });
    expenseCategory.save().then(income => {
        res.status(201).json({
            expenseCategory: {
                ... expenseCategory,
                id: expenseCategory._id,
            }
        });
    }).catch( err => {
        res.status(500).json({
            message: err.message
        })
    });
};

/**
 * Retrieves account categories list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.retrieveExpenseCategories = (req, res, next) => {
    const pageSize = + req.query.pageSize;
    const currentPage = + req.query.page;
    const expenseCategoryQuery = ExpenseCategory.find();
    let fetchedExpenseCategories;
    if (currentPage && pageSize) {
        expenseCategoryQuery.skip(pageSize *(currentPage - 1)).limit(pageSize);
    }
    expenseCategoryQuery.then( documents => {
        fetchedExpenseCategories = documents;
        return ExpenseCategory.count();
    }).then(count => {
        res.status(200).json({
            expenseCategories: fetchedExpenseCategories,
            maxExpenseCategories: count
        });
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    });
};