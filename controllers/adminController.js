const express = require('express');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const Analytics = require('./../models/analytics');
const Subscribers = require('./../models/subscriber');




exports.viewAdmin = catchAsync( async(req, res) => {

    const getAnalytics = await Analytics.find();
    const getSubscribers = await Subscribers.find();

    if(!getAnalytics){
        return next(new AppError('Can not find any data', 400));
    }

    if(!getSubscribers){
        return next(new AppError('Can not find any data', 400));
    }


    res.status(200).render('admin/index',{
        title: 'Mathew Marciel Music - Admin Page',
        analyticsLength : getAnalytics.length,
        getSubscribers
    });
});