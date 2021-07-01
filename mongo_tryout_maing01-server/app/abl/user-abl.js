"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/user-error.js");

const WARNINGS = {
  CreateUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
};

class UserAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("user");
  }
  async create(awid, dtoIn, uuAppErrorMap = {}) {
    let validationResult = this.validator.validate("createUserDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.CreateUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    let dtoOut;

    try {
      dtoOut = await this.dao.create({...dtoIn, awid});
    } catch (e) {
      throw Errors.Create.UserCreateDaoFailed(uuAppErrorMap, {dtoIn, cause: e})
    }

    return { ...dtoOut, uuAppErrorMap };
  }

}

module.exports = new UserAbl();
