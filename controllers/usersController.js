const express = require('express');
const fs = require('fs');
const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));
const Users = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.checkID = (req, res, next, val) =>  {

    if(req.params.id * 1 > users.length - 1){
        return res.status(404).json({
            status: 'fail',
            message: 'Can not find the user you were looking for'
        });
    }

    next();
}


exports.checkBody = (req, res, next) =>  {

    if(!req.body.name){
        return res.status(404).json({
            status: 'fail',
            message: 'Can not find parameter name'
        });
    }

    next();
}

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };


  exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  }; 

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
  
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
  
    // 3) Update user document
    const updatedUser = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });
  
  exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
  
    res.status(204).json({
      status: 'success',
      data: null
    });
  });



exports.getAllUsers = catchAsync( async(req,res, next)=>{

    const allUsers = await Users.find() 

    if(!allUsers){
        return next(new AppError('Can not find any users', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'Here is the data for users',
        app: 'Mathew Maciel Website',
        requestedAt: req.requestTime,
        result: allUsers.length,
        data:{
            allUsers
        }  
    });

});

exports.getUser = (req,res)=>{
 
    const id = req.params.id * 1;
    const findUser = users.find(el => el.id === id);


    if(!findUser){
        return res.status(404).json({
            status: 'fail',
            message: 'cannot find the user you were looking for'
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Here is the data that you are looking for',
        app: 'Mathew Maciel Website',
        data:{
            user: findUser
        }  
    });
}

exports.addUser = (req, res) =>{
    console.log(req.body);

    const newId = users[users.length - 1].id + 1;
    const newUser = Object.assign({id : newId}, req.body);

    users.push(newUser);
    fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), err => {
        res.status(201).json({
            status: "success",
            data: {
                user : newUser
            }
        });
    });
}

exports.editUser = (req, res) => {

    if(req.params.id * 1 > users.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Can not find the user you were looking for'
        });
    }

    res.status(200).json({
        status: 'Success', 
        data: {
            users: '<Updated User Here>'
        }
    });
}

exports.deleteUser = catchAsync( async (req, res) => {

    const userDeleted = await Users.findByIdAndDelete(req.params.id);

    if(!userDeleted){
        return res.status(404).json({
            status: 'fail',
            message: 'Can not find the user you were looking for'
        });
    }

    res.status(200).json({
        status: 'Success', 
        data: null
    });
});
