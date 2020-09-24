// For Connection Pooling

const express = require('express');

const router = express.Router();

var pool = require('./poolDatabase');

const uuid = require('uuid');

// Read All
router.get('/', async (req, res, next) => {
    const abc = await pool.query(function (err) {
        pool.query(`SELECT * FROM school_db.teacher_master`, function (err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});

//Aggregate Information
router.get('/group', async (req, res, next) => {

    const key_name = req.body.key_name.toString();
    let filter_name = req.body.filter_name ? req.body.filter_name.toString() : "";
    let filter_value = req.body.filter_value ? req.body.filter_value.toString() : "";

    const { key_type } = req.body;

    //Switching different case conditions 
    switch (key_type) {
        case 1: // Count        {"key_name" : "first_name","key_type" : 1}
            var queryCheck = "select " + key_name + ", count(*) Count from school_db.teacher_master group by " + key_name;
            break;
        case 2: // Sum        
            var queryCheck = "select " + key_name + ", sum(*) Sum from school_db.teacher_master group by " + key_name;
            break;
        case 3: // Max        
            var queryCheck = "select " + key_name + ", max(*) Max from school_db.teacher_master group by " + key_name;
            break;
        case 4: // Min        
            var queryCheck = "select " + key_name + ", min(*) Min from school_db.teacher_master group by " + key_name;
            break;
        case 5: // Avg        
            var queryCheck = "select " + key_name + ", avg(*) Avg from school_db.teacher_master group by " + key_name;
            break;
        case 11: // Count        {"key_name" : "first_name","key_type" : 11,"filter_name" : "first_name","filter_value" : "John"}
            var queryCheck = "select " + key_name + ", count(*) Count from school_db.teacher_master group by " + key_name + " having " + filter_name + " = '" + filter_value + "'";
            break;
        case 12: // Sum        
            var queryCheck = "select " + key_name + ", sum(*) Sum from school_db.teacher_master group by " + key_name + " having " + filter_name + " = '" + filter_value + "'";
            break;
        case 13: // Max        
            var queryCheck = "select " + key_name + ", max(*) Max from school_db.teacher_master group by " + key_name + " having " + filter_name + " = '" + filter_value + "'";
            break;
        case 14: // Min        
            var queryCheck = "select " + key_name + ", min(*) Min from school_db.teacher_master group by " + key_name + " having " + filter_name + " = '" + filter_value + "'";
            break;
        case 15: // Avg        
            var queryCheck = "select " + key_name + ", avg(*) Avg from school_db.teacher_master group by " + key_name + " having " + filter_name + " = '" + filter_value + "'";
            break;
        default:
            console.log('Unkown type');
    }

    const item = await pool.query(function (err) {
        pool.query(queryCheck,
            function (err, result, fields) {
                if (err) res.send(err);
                if (result) res.send(result);
            });
    });
});

//Search based on criteria
router.get('/search', async (req, res, next) => {
    const key_name = req.body.key_name ? req.body.key_name.toString() : "";
    let key_value = req.body.key_value ? req.body.key_value.toString() : "";
    let key_limit = req.body.key_limit ? req.body.key_limit.toString() : 100;
    let key_page = req.body.key_page ? req.body.key_page.toString() : 1;

    //Converting Page information into SQL Offser Information
    if (key_page == 1)
        var key_offset = (key_page - 1) * (key_limit);
    else
        var key_offset = ((key_page - 1) * (key_limit)) + 1;

    const { key_type } = req.body;

    //Switching different case conditions 
    switch (key_type) {
        case 1: // String - Contains        {"key_name" : "first_name","key_value" : "john","key_type" : 1}
            var queryCheck = "select * from school_db.teacher_master where " + key_name + " like '%" + key_value + "%' limit " + key_offset + ", " + key_limit;
            break;
        case 2: // String - Starts With     {"key_name" : "first_name","key_value" : "jo","key_type" : 2}
            var queryCheck = "select * from school_db.teacher_master where " + key_name + " like '" + key_value + "%' limit " + key_offset + ", " + key_limit;
            break;
        case 3: // String - Ends With       {"key_name" : "first_name","key_value" : "hn","key_type" : 3}
            var queryCheck = "select * from school_db.teacher_master where " + key_name + " like '%" + key_value + "' limit " + key_offset + ", " + key_limit;
            break;
        case 4: // String - Contains        {"key_name" : "gender","key_value" : "'male','female'","key_type" : 4}
            var queryCheck = "select * from school_db.teacher_master where " + key_name + " in (" + key_value + ") limit " + key_offset + ", " + key_limit;
            break;
        case 5: // Number - Greater Than    {"key_name" : "mobile","key_value" : "5000000","key_type" : 5}
            var queryCheck = "select * from school_db.teacher_master where " + key_name + " > " + key_value + " limit " + key_offset + ", " + key_limit;
            break;
        case 6: // Number - Less Than    {"key_name" : "mobile","key_value" : "5000","key_type" : 6}
            var queryCheck = "select * from school_db.teacher_master where " + key_name + " < " + key_value + " limit " + key_offset + ", " + key_limit;
            break;
        case 7: // Number - Equal to    {"key_name" : "mobile","key_value" : "5000","key_type" : 7}
            var queryCheck = "select * from school_db.teacher_master where " + key_name + " = " + key_value + " limit " + key_offset + ", " + key_limit;
            break;
        case 8: // Date - Less Than     {"key_name" : "date_of_birth","key_value" : "2011-12-28","key_type" : 8}
            var queryCheck = "select * from school_db.teacher_master where DATE(" + key_name + ") < ('" + key_value + "') limit " + key_offset + ", " + key_limit;
            break;
        case 9: // Date - Greater Than      {"key_name" : "date_of_birth","key_value" : "2011-12-28","key_type" : 9}
            var queryCheck = "select * from school_db.teacher_master where DATE(" + key_name + ") > ('" + key_value + "') limit " + key_offset + ", " + key_limit;
            break;
        case 10: // Date - Equal To      {"key_name" : "date_of_birth","key_value" : "2011-12-28","key_type" : 10}
            var queryCheck = "select * from school_db.teacher_master where DATE(" + key_name + ") = ('" + key_value + "') limit " + key_offset + ", " + key_limit;
            break;
        default:
            console.log('Unkown type');
    }

    const item = await pool.query(function (err) {
        pool.query(queryCheck,
            function (err, result, fields) {
                if (err) res.send(err);
                if (result) res.send(result);
            });
    });
});

// Read One
router.get('/:id', async (req, res, next) => {
    try {
        // Get ID from request body
        const { id } = req.params;

        // Find if the ID exists in the database
        const item = await pool.query(function (err) {
            pool.query(`SELECT * FROM school_db.teacher_master where teacher_id='` + id + "'",
                function (err, result, fields) {
                    if (err) res.send(err);
                    if (result) res.send(result);
                });
        });
    } catch (error) {
        next(error);
    }
});

// Create One
router.post('/', async (req, res, next) => {
    var uniqueID = uuid.v4() + '';

    const abc = await pool.query(function (err) {
        pool.query(`INSERT INTO school_db.teacher_master (teacher_id,first_name,last_name,email,gender,mobile,date_of_birth) VALUES
        ('${uniqueID}','${req.body.first_name}','${req.body.last_name}',
        '${req.body.email}','${req.body.gender}',${req.body.mobile},'${req.body.date_of_birth}')`,
            function (err, result, fields) {
                if (err) res.send(err);
                if (result) res.send('Data Inserted Successfully');
                if (fields) console.log(fields);
            });
    });
});

// Update One
router.put('/:id', async (req, res, next) => {
    try {
        // Get ID from request body
        const { id } = req.params;

        // Find if the ID exists in the database
        const item = await pool.query(function (err) {
            pool.query(`SELECT * FROM school_db.teacher_master where teacher_id='` + id + "'",
                function (err, result, fields) {
                    if (err) res.send(err);
                    if (result && result.length)
                        pool.query(`UPDATE school_db.teacher_master SET first_name = '${req.body.first_name}', last_name = '${req.body.last_name}', email = '${req.body.email}', gender = '${req.body.gender}', mobile = '${req.body.mobile}', date_of_birth = '${req.body.date_of_birth}' where teacher_id = '${id}'`,
                            function (err1, result1, fields1) {
                                if (err1) res.send(err1);
                                if (result1) res.send('Data Updated Successfully');
                                if (fields1) console.log(fields1);
                            });
                    else {
                        res.send('Record not found.');
                    }
                });
        });
    } catch (error) {
        next(error);
    }
});

// Delete One
router.delete('/:id', async (req, res, next) => {
    try {
        // Get ID from request body
        const { id } = req.params;

        // Find if the ID exists in the database
        const item = await pool.query(function (err) {
            pool.query(`SELECT * FROM school_db.teacher_master where teacher_id='` + id + "'",
                function (err, result, fields) {
                    if (err) res.send(err);
                    if (result && result.length)
                        pool.query(`DELETE FROM school_db.teacher_master where teacher_id = '${id}'`,
                            function (err1, result1, fields1) {
                                if (err1) res.send(err1);
                                if (result1) res.send('Data Deleted Successfully');
                                if (fields1) console.log(fields1);
                            });
                    else {
                        res.send('Record not found.');
                    }
                });
        });
    } catch (error) {
        next(error);
    }
});
module.exports = router;

