import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  private options = { name: "mmypnew_000.db", location: 'default', createFromLocation: 1 };
  constructor(private sqlite: SQLite, private platform: Platform) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create(this.options)
        .then((db: SQLiteObject) => {
          this.database = db;
          // console.log("DB Provider is ready")
         // this.databaseReady.next(true);
        });
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  async getAllCategoryEng() {
    return await this.database.executeSql("SELECT catName,syskey from tblcategory ORDER BY catName", []).then((data) => {
      let category = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          category.push({ name: data.rows.item(i).catName, value: data.rows.item(i).syskey });
        }
        // console.log("getAllCategoryEng>>")
      }
      return category;
    }, err => {
      // console.log('Error: ', err);
      return [];
    });
  }

  getAllCategoryMM() {
    return this.database.executeSql("SELECT catNamemm,syskey from tblcategory ORDER BY catNamemm", []).then((data) => {
      let category = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          category.push({ name: data.rows.item(i).catNamemm, value: data.rows.item(i).syskey });
        }
      }
      return category;
    }, err => {
      // console.log('Error: ', err);
      return [];
    });
  }

  async searchByNameCatetory(cname, catid) {
    let query;
    if (catid == "") {
      // console.log("cname>>" + cname)
      query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid " +
        " left join tbllocation on tblbusiness.locid = tbllocation.syskey left join tblcategory on tblbuscat.catid = tblcategory.syskey" +
        " WHERE tblbusiness.name LIKE '" + cname + "%' GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC LIMIT 1000";
    } else if (cname == "") {
      query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid " +
        " left join tbllocation on tblbusiness.locid = tbllocation.syskey left join tblcategory on tblbuscat.catid = tblcategory.syskey" +
        " WHERE tblbuscat.catId ='" + catid + "' GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC";
    } else {
      query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName  FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid left join tbllocation on " +
        " tblbusiness.locid = tbllocation.syskey left join tblcategory on tblbuscat.catid = tblcategory.syskey " +
        " WHERE tblbusiness.name LIKE '" + cname + "%' and tblbuscat.catId ='" + catid + "' GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC LIMIT 1000";
    }
    // console.log("query1>>" + query);
    return await this.database.executeSql(query, []).then((data) => {
      let description = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          description.push({
            syskey: data.rows.item(i).syskey, name: data.rows.item(i).name,
            title: data.rows.item(i).title, address: data.rows.item(i).address, locId: data.rows.item(i).locId,
            categoryId: data.rows.item(i).categoryId, adsStatus: data.rows.item(i).adsStatus,
            phone: data.rows.item(i).phone, email: data.rows.item(i).email,
            fax: data.rows.item(i).fax, websit: data.rows.item(i).websit,
            locName: data.rows.item(i).locName, catName: data.rows.item(i).catName
            , mapLat: data.rows.item(i).mapLat, mapLon: data.rows.item(i).mapLon
          });
        }
        // console.log("searchByNameCatetory>>" + JSON.stringify(description));
      }
      return description;
    }, err => {
      // console.log('Error: ', err);
      return [];
    });
  }

  async searchByPopularCatetory(locid, catid) {
    let query;
    if (locid == "Other Cities") {
      query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid " +
        " left join tblcategory on tblbuscat.catid = tblcategory.syskey left join tbllocation on tblbusiness.locid = tbllocation.syskey " +
        "  WHERE tblbuscat.catId ='" + catid + "'  And tbllocation.locState NOT IN('Yangon','Mandalay','Naypyitaw')  GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC";
    } else if (locid == "Naypyitaw") {
      query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid " +
        " left join tblcategory on tblbuscat.catid = tblcategory.syskey left join tbllocation on tblbusiness.locid = tbllocation.syskey " +
        " WHERE tblbuscat.catId ='" + catid + "'  And tbllocation.locState = 'Naypyitaw' GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC";
    } else if (locid == "Yangon") {
      query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid " +
        " left join tblcategory on tblbuscat.catid = tblcategory.syskey left join tbllocation on tblbusiness.locid = tbllocation.syskey " +
        " WHERE tblbuscat.catId ='" + catid + "'  And tbllocation.locState = 'Yangon'  GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC";
    } else if (locid == "Mandalay") {
      query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid " +
        " left join tblcategory on tblbuscat.catid = tblcategory.syskey left join tbllocation on tblbusiness.locid = tbllocation.syskey " +
        " WHERE tblbuscat.catId ='" + catid + "' And tbllocation.locState = 'Mandalay' GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC";
    } else {
      query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName  FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid  " +
        " left join tblcategory on tblbuscat.catid = tblcategory.syskey left join tbllocation on tblbusiness.locid = tbllocation.syskey " +
        " WHERE tblbuscat.catId ='" + catid + "' GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC";
    }
    // console.log("query2>>" + query);
    return await this.database.executeSql(query, []).then((data) => {
      let description = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          description.push({
            syskey: data.rows.item(i).syskey, name: data.rows.item(i).name,
            title: data.rows.item(i).title, address: data.rows.item(i).address, locId: data.rows.item(i).locId,
            categoryId: data.rows.item(i).categoryId, adsStatus: data.rows.item(i).adsStatus,
            phone: data.rows.item(i).phone, email: data.rows.item(i).email,
            fax: data.rows.item(i).fax, websit: data.rows.item(i).websit,
            locName: data.rows.item(i).locName, catName: data.rows.item(i).catName
            , mapLat: data.rows.item(i).mapLat, mapLon: data.rows.item(i).mapLon
          });
        }
        // console.log("searchByPopularCatetory>>" + JSON.stringify(description));
      }
      return description;
    }, err => {
      // console.log('Error: ', err);
      return [];
    });
  }

  async searchByName(type, name) {
    let query;
    if (type == "2") {
      query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid " +
        " left join tblcategory on tblbuscat.catid = tblcategory.syskey left join tbllocation on tblbusiness.locid = tbllocation.syskey " +
        " WHERE tblbusiness.name LIKE  '%" + name + "%' GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC LIMIT 1000";
    } else {
      query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid  " +
        " left join tblcategory on tblbuscat.catid = tblcategory.syskey left join tbllocation on tblbusiness.locid = tbllocation.syskey " +
        " WHERE tblbusiness.name LIKE '" + name + "%' GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC,tblbusiness.name ASC LIMIT 1000";
    }
    // console.log("query3>>" + query);
    return await this.database.executeSql(query, []).then((data) => {
      let description = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          description.push({
            syskey: data.rows.item(i).syskey, name: data.rows.item(i).name,
            title: data.rows.item(i).title, address: data.rows.item(i).address, locId: data.rows.item(i).locId,
            categoryId: data.rows.item(i).categoryId, adsStatus: data.rows.item(i).adsStatus,
            phone: data.rows.item(i).phone, email: data.rows.item(i).email,
            fax: data.rows.item(i).fax, websit: data.rows.item(i).websit,
            locName: data.rows.item(i).locName, catName: data.rows.item(i).catName
            , mapLat: data.rows.item(i).mapLat, mapLon: data.rows.item(i).mapLon
          });
        }
        // console.log("searchByName>>" + JSON.stringify(description));
      }
      return description;
    }, err => {
      // console.log('Error: ', err);
      return [];
    });
  }

  async searchByCity(cityid, catid) {
    let query; let catIdClause = "";
    if (catid != "") {
      catIdClause = " and tblbuscat.catId ='" + catid + "' ";
    }
    query = "SELECT tblbusiness.*, tblbuscat.catId categoryId,tbllocation.locName locName, tblcategory.catName catName  FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid  " +
      " left join tblcategory on tblbuscat.catid = tblcategory.syskey left join tbllocation on tblbusiness.locid = tbllocation.syskey " +
      " WHERE tblbusiness.locId ='" + cityid + "'" + catIdClause + " GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC";
    // console.log("query4>>" + query);
    return await this.database.executeSql(query, []).then((data) => {
      let description = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          description.push({
            syskey: data.rows.item(i).syskey, name: data.rows.item(i).name,
            title: data.rows.item(i).title, address: data.rows.item(i).address, locId: data.rows.item(i).locId,
            categoryId: data.rows.item(i).categoryId, adsStatus: data.rows.item(i).adsStatus,
            phone: data.rows.item(i).phone, email: data.rows.item(i).email,
            fax: data.rows.item(i).fax, websit: data.rows.item(i).websit,
            locName: data.rows.item(i).locName, catName: data.rows.item(i).catName
            , mapLat: data.rows.item(i).mapLat, mapLon: data.rows.item(i).mapLon
          });
        }
        // console.log("searchByName>>" + JSON.stringify(description));
      }
      return description;
    }, err => {
      // console.log('Error: ', err);
      return [];
    });
  }

  async getTownshipByCity(city) {
    let query;
    if (city == "Other Cities") {
      query = "SELECT * FROM tbllocation WHERE locState NOT IN('Yangon','Mandalay','Naypyitaw') ORDER BY locName";
    } else if (city == "Naypyitaw") {
      query = "SELECT * FROM tbllocation WHERE locState ='Naypyitaw' ORDER BY locName";
    } else if (city == "Yangon") {
      query = "SELECT * FROM tbllocation WHERE locState ='Yangon' ORDER BY locName";
    } else if (city == "Mandalay") {
      query = "SELECT * FROM tbllocation WHERE locState ='Mandalay' ORDER BY locName";
    } else {
      query = "SELECT  * from tbllocation ORDER BY locName";
    }
    // console.log("query6>>" + query);
    return await this.database.executeSql(query, []).then((data) => {
      let category = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          category.push({ name: data.rows.item(i).locName, value: data.rows.item(i).syskey });
        }
      }
      return category;
    }, err => {
      // console.log('Error: ', err);
      return [];
    });
  }

  async searchByCategory(catName, langType) {
    let query;
    if (catName != "") {
      if (langType == "eng") {
        query = "SELECT * FROM tblcategory WHERE  catName LIKE '" + catName + "%' ORDER BY catName";
      } else {
        query = "SELECT * FROM tblcategory WHERE  catNamemm LIKE '" + catName + "%' ORDER BY catNamemm";
      }
    } else {
      if (langType == "eng") {
        query = "SELECT * FROM tblcategory ORDER BY catName";
      } else {
        query = "SELECT * FROM tblcategory ORDER BY catNamemm";
      }
    }
    // console.log("query7>>" + query);
    return await this.database.executeSql(query, []).then((data) => {
      let category = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          category.push({ name: data.rows.item(i).catName, nameMM: data.rows.item(i).catNamemm, value: data.rows.item(i).syskey });
        }
      }
      // console.log("searchByCategory>>" + JSON.stringify(category));
      return category;
    }, err => {
      // console.log('Error: ', err);
      return [];
    });
  }

  async getImageByBusiId(busid) {
    let query;
    query = "SELECT imgName FROM tblimage WHERE businessId = '" + busid + "'";
    // console.log("query8>>" + query);
    return await this.database.executeSql(query, []).then((data) => {
      let image = "";
      if (data.rows.length > 0) {
        image = data.rows.item(0).imgName;
      }
      // console.log("getImageByBusiId>>" + image);
      return image;
    }, err => {
      // console.log('Error: ', err);
      return "";
    });
  }

  async getAreacode(locid, filterid) {
    let query;
    if (filterid == "phone") {
      query = "SELECT locArea FROM tbllocation where syskey = '" + locid + "'";
    } else {
      query = "SELECT locName,locState FROM tbllocation where syskey = '" + locid + "'";
    }
    // console.log("query11>>" + query);
    return await this.database.executeSql(query, []).then((data) => {
      let area = "";
      if (data.rows.length > 0) {
        if (filterid == "phone") {
          area = data.rows.item(0).locArea;
        }  else {
          if (data.rows.item(0).locState=="Regional") {
            area = ", " + data.rows.item(0).locName;
          } else {
            area = ", " + data.rows.item(0).locName + ", " + data.rows.item(0).locState;
          }
        }
      }
      // console.log("getAreacode>>" + area);
      return area;
    }, err => {
      // console.log('Error: ', err);
      return [];
    });
  }

  async getPublishedDate() {
    return await this.database.executeSql("SELECT publishDate FROM tblsetting", []).then((data) => {
      let publishDate = "";
      if (data.rows.length > 0) {
        publishDate = data.rows.item(0).publishDate;
        // console.log("data.rows.item(0).publishDate>>" + data.rows.item(0).publishDate)
      }
      return publishDate;
    }, err => {
      // console.log('Error: ', err);
      return "";
    });
  }

  async updatePublichedDate() {
    return await this.database.executeSql("UPDATE tblsetting SET publishDate = '2019-02-28 21:44:51.000'", []).then((data) => {
      /* let publishDate = "";
      if (data.rows.length > 0) {
        publishDate = data.rows.item(0).publishDate;
        // console.log("data.rows.item(0).publishDate>>"+ data.rows.item(0).publishDate)
      } */
      return "ok";
    }, err => {
      // console.log('Error: ', err);
      return "";
    });
  }

  async deleteTBData(deleteArr) {
    for (let i = 0; i < deleteArr.length; i++) {
      let jsonObject = deleteArr[i];
      let tableName = jsonObject.tblname;
      let sysKey = jsonObject.syskey;
      await this.database.executeSql("DELETE FROM " + tableName + " WHERE syskey = ?", [sysKey]).then((data) => {
        // console.log("Deleted successfully>>" + tableName + ":" + sysKey)
      }, err => {
        // console.log('Error: ', err);
        return false;
      });
    }
    return true;
  }

  async deleteTBDataV2(deleteArr) {
    let insertRows = [];
    deleteArr.forEach(item => {
      insertRows.push(["DELETE FROM " + item.tblname + " WHERE syskey = ?", [item.syskey]]);
    });
    return await this.database.sqlBatch(insertRows).then((result) => {
      // console.log("Deleted successfully>>")
      return true;
    }, err => {
      // console.log('Error: ', err);
      return false;
    });
  }

  async checkData(tableName, syskey) {
    return await this.database.executeSql("SELECT * FROM " + tableName + " WHERE syskey = ?", [syskey]).then((data) => {
      if (data.rows.length > 0) {
        // console.log("Check Data>>" + tableName + ":" + syskey)
        return true;
      } else {
        return false;
      }
    }, err => {
      // console.log('Error: ', err);
      return false;
    });
  }

  async updateAllBusinessData(categoryList) {
    if(categoryList.length > 0){
      let insertRows = [];
      categoryList.forEach(data => {
        this.checkData("tblbusiness", data.syskey).then(flag => {
          if (flag) {
            let sql = "UPDATE tblbusiness SET name=?, address=?, phone=?, fax=?, email=?, websit=?, title=?, description=?, mapLat=?, mapLon=?, locId=?, catId=?, imageId=?, " +
                      "adsStatus=?, status=?, createUsr=?, modify_at=?, db_status=? WHERE syskey=?";
                    let param = [data.name, data.address, data.phone, data.fax, data.email, data.websit, data.title,
                    data.description, data.mapLat, data.mapLon, data.locId, data.catId, data.imageId,
                    data.adsStatus, data.status, data.createUsr, data.modify_at, data.db_status, data.syskey];
            insertRows.push([sql, param]);
          } else {
            let sql = "INSERT INTO tblbusiness (syskey, name, address, phone, fax, email, websit, title, " +
            "description, mapLat, mapLon, locId, catId, imageId, adsStatus, status, createUsr, modify_at, db_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)";
          let param = [data.syskey, data.name, data.address, data.phone, data.fax, data.email, data.websit, data.title,
          data.description, data.mapLat, data.mapLon, data.locId, data.catId, data.imageId,
          data.adsStatus, data.status, data.createUsr, data.modify_at, data.db_status];
            insertRows.push([sql, param]);
          }
        })
      
    });
    return await this.database.sqlBatch(insertRows).then((result) => {
      // console.log("Updated successfully>>tblbusiness")
      return true;
    }, err => {
      // console.log('Error: ', err);
      return false;
    });
    }
  }

  async updateAllCategoryData(dataList) {
    if(dataList.length > 0){
      let insertRows = [];
      dataList.forEach(data => {
        this.checkData("tblcategory", data.syskey).then(flag => {
          if (flag) {
            let sql = "UPDATE tblcategory SET catName=?, catNamemm=?, catCode=?, catImg=?, featureStatus=?, popularStatus=?, modify_at=?, db_status=? WHERE syskey=?";
            let param = [data.catName, data.catNamemm, data.catCode, data.catImg, data.featureStatus, data.popularStatus, data.modify_at, data.db_status, data.syskey];
            insertRows.push([sql, param]);
          } else {
            let sql = "INSERT INTO tblcategory (syskey, catName, catNamemm, catCode, catImg, featureStatus, popularStatus, modify_at, db_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            let param = [data.syskey, data.catName, data.catNamemm, data.catCode, data.catImg, data.featureStatus, data.popularStatus, data.modify_at, data.db_status];
            insertRows.push([sql, param]);
          }
        })
    });
    return await this.database.sqlBatch(insertRows).then((result) => {
      // console.log("Updated successfully>>tblcategory")
      return true;
    }, err => {
      // console.log('Error: ', err);
      return false;
    });
    }
  }

  async updateAllBusCatData(dataList) {
    if(dataList.length > 0){
      let insertRows = [];
      dataList.forEach(data => {
        this.checkData("tblbuscat", data.syskey).then(flag => {
          if (flag) {
            let sql = "UPDATE tblbuscat SET busCatid=?, catId=?, modify_at=?, db_status=? WHERE syskey=?";
            let param = [data.busCatid, data.catId, data.modify_at, data.db_status, data.syskey];
            insertRows.push([sql, param]);
          } else {
            let sql = "INSERT INTO tblbuscat (syskey, busCatid, catId, modify_at, db_status) VALUES (?, ?, ?, ?, ?)";
            let param = [data.syskey, data.busCatid, data.catId, data.modify_at, data.db_status];
            insertRows.push([sql, param]);
          }
        })
    });
    return await this.database.sqlBatch(insertRows).then((result) => {
      // console.log("Updated successfully>>tblbuscat")
      return true;
    }, err => {
      // console.log('Error: ', err);
      return false;
    });
    }
  }

  async updateAllLocationData(dataList) {
    if(dataList.length > 0){
      let insertRows = [];
      dataList.forEach(data => {
        this.checkData("tbllocation", data.syskey).then(flag => {
          if (flag) {
            let sql = "UPDATE tbllocation SET locState=?, locArea=?, locName=?, modify_at=?, db_status=? WHERE syskey=?";
            let param = [data.locState, data.locArea, data.locName, data.modify_at, data.db_status, data.syskey];
            insertRows.push([sql, param]);
          } else {
            let sql = "INSERT INTO tbllocation(syskey, locState, locArea, locName, modify_at, db_status) VALUES (?, ?, ?, ?, ?, ?)"
            let param = [data.syskey, data.locState, data.locArea, data.locName, data.modify_at, data.db_status];
            insertRows.push([sql, param]);
          }
        })
    });
    return await this.database.sqlBatch(insertRows).then((result) => {
      // console.log("Updated successfully>>tbllocation")
      return true;
    }, err => {
      // console.log('Error: ', err);
      return false;
    });
    }
  }

  async updateAllImageData(dataList) {
    if(dataList.length > 0){
      let insertRows = [];
      dataList.forEach(data => {
        this.checkData("tblimage", data.syskey).then(flag => {
          if (flag) {
            let sql = "UPDATE tblimage SET imgName=?, businessId=?, modify_at=?, db_status=? WHERE syskey=?";
            let param = [data.imgName, data.businessId, data.modify_at, data.db_status, data.syskey];
            insertRows.push([sql, param]);
          } else {
            let sql = "INSERT INTO tblimage(syskey, imgName, businessId, modify_at, db_status) VALUES (?, ?, ?, ?, ?)";
            let param = [data.imgName, data.businessId, data.modify_at, data.db_status, data.syskey];
            insertRows.push([sql, param]);
          }
        })
    });
    return await this.database.sqlBatch(insertRows).then((result) => {
      // console.log("Updated successfully>>tblimage")
      return true;
    }, err => {
      // console.log('Error: ', err);
      return false;
    });
    }
  }

  async updateSettingData(date) {
    let sql = "UPDATE tblsetting SET publishDate=? WHERE version=1";
    let param = [date];
    return await this.database.executeSql(sql, param).then((result) => {
      // console.log("Updated successfully>>" + "tblsetting:" + date)
      return true;
    }, err => {
      // console.log('Error: ', err);
      return false;
    });
  }
}