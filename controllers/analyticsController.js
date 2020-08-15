const express = require('express');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const Analytics = require('./../models/analytics');



exports.getAnalytics = catchAsync( async (req, res) => {

    const allAnalytics = await Analytics.find() 

    if(!allAnalytics){
        return next(new AppError('Can not find any data', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'Here is the data for analytics',
        app: 'Mathew Maciel Website',
        requestedAt: req.requestTime,
        result: allAnalytics.length,
        data:{
            allAnalytics
        }  
    });

});


exports.postAnalytics = catchAsync( async (req, res) => {

    if(!req.body.ipAddress){
        res.status(201).json({
            status: "Failed!",
            message: "ipAddress can not be found"
        });
    }



    const newAnalytics = await Analytics.create(req.body);
    if(!newAnalytics){ return next(new AppError('Something went wrong with uploading a new music', 404)); }


    res.status(201).json({
        status: "success",
        data: {
            analytics: newAnalytics
        }
    });

});