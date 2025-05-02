import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toCurrency } from "../assets/javascript/functionTool";
import Loading from "./Loading";
import axios from 'axios'
const HomePage = () => {
  let [designerList, setDesignerList] = useState([])
  let [assistantList, setAssistantList] = useState([])
  let [serviceItem, setServiceItem] = useState([])
  // let serviceItem = [
  //   { itemName: "洗髮護理", fee: "", isHaveFee: "false" },
  //   { itemName: "洗髮", fee: "300", isHaveFee: "true" },
  //   { itemName: "洗髮卡", fee: "180", isHaveFee: "true" },
  //   { itemName: "購買洗髮卡", fee: "1800", isHaveFee: "true" },
  //   { itemName: "剪髮設計", fee: "", isHaveFee: "false" },
  //   { itemName: "燙髮設計", fee: "", isHaveFee: "false" },
  //   { itemName: "染髮設計", fee: "", isHaveFee: "false" },
  //   { itemName: "護髮療程", fee: "", isHaveFee: "false" },
  //   { itemName: "護髮(一般)", fee: "550", isHaveFee: "true" },
  //   { itemName: "護髮(物化機)", fee: "800", isHaveFee: "true" },
  //   { itemName: "頭皮療程", fee: "", isHaveFee: "false" },
  //   { itemName: "頭皮精油", fee: "799", isHaveFee: "true" },
  //   { itemName: "頭皮SPA", fee: "699", isHaveFee: "true" },
  //   { itemName: "頭皮隔離", fee: "200", isHaveFee: "true" },
  //   { itemName: "上青捲", fee: "", isHaveFee: "false" },
  //   { itemName: "其他", fee: "", isHaveFee: "false" },
  // ];
  //* values
  let [personnelData, setPersonnelData] = useState({
    owner: "",
    assistant: "",
    customer: "",
  }),
    [createServiceItem, setCreateServiceItem] = useState([
      { id: 1, itemName: "", fee: "" },
    ]),
    [total, setTotal] = useState(0),
    [thisStep, setThisStep] = useState("one"), //one , two
    [isHavePro, setIsHavePro] = useState(false), //是否有購買產品
    [isLoading, setIsLoading] = useState(false),
    [createProductItem, setCreateProductItem] = useState([
      { id: 1, itemName: "", fee: "" },
    ]);
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleAPI = {
    getList: function () {
      let API = `https://script.google.com/macros/s/AKfycbzfxykuqhLn6ANQTI7H2msx6wedOJ66NouLIoHNXwbUTHabacoKLgVY5wziRZpoKWpM/exec`
      setIsLoading(true)
      axios.get(API)
        .then((res) => {
          setIsLoading(false)
          setDesignerList(res.data.design)
          setAssistantList(res.data.assistant)
          setServiceItem(res.data.proItem)
        })
        .catch((err) => {
          console.log(err)
          alert('通知管理員')
          setIsLoading(false)
          setDesignerList(["Annie", "Eric"])
          setAssistantList(["Annie", "Eric"])
        })
    }
  }

  const handleEvent = {
    addItem: function (e, type) {
      e.preventDefault();
      if (type == "service") {
        setCreateServiceItem([
          ...createServiceItem,
          {
            id: getRandom(1, 100) + createServiceItem.length,
            itemName: "",
            fee: "",
          },
        ]);
      } else if (type == "product") {
        setCreateProductItem([
          ...createProductItem,
          {
            id: getRandom(1, 100) + createServiceItem.length,
            itemName: "",
            fee: "",
          },
        ]);
      }
    },
    delItem: function (e, id, type) {
      e.preventDefault();
      if (type == "service") {
        let newAry = [];
        createServiceItem.map((item, index) => {
          if (Number(id) !== Number(item.id)) {
            newAry.push(item);
          }
        });
        setCreateServiceItem(newAry);
      } else if (type == "product") {
        let proAry = [];
        createProductItem.map((item, index) => {
          if (Number(id) !== Number(item.id)) {
            proAry.push(item);
          }
        });
        setCreateProductItem(proAry);
      }
    },
    chooseServiceItem: function (id, e, type) {
      //選擇服務項目
      let { value } = e.target;
      if (type == "service") {
        createServiceItem.map((item, index) => {
          if (id == item.id) {
            item.itemName = value.split("-")[0];
            item.fee = value.split("-")[1];
            item.isHaveFee = value.split("-")[2];
          }
        });
        setCreateServiceItem([...createServiceItem]);
      } else if (type == "product") {
        createProductItem.map((item, index) => {
          if (id == item.id) {
            item.itemName = value;
          }
        });
        setCreateProductItem([...createProductItem]);
      }
    },
    setFee: function (id, e, type) {
      //設定價錢
      let { value } = e.target;
      if (type == "service") {
        createServiceItem.map((item, index) => {
          if (id == item.id) {
            item.fee = value;
          }
        });
        setCreateServiceItem([...createServiceItem]);
      } else if (type == "product") {
        createProductItem.map((item, index) => {
          if (id == item.id) {
            item.fee = value;
          }
        });
        setCreateProductItem([...createProductItem]);
      }
    },
    calTotal: function () {
      //計算總數
      let num = 0;
      let proNum = 0;
      createServiceItem.map((item, index) => {
        num += Number(item.fee);
      });
      createProductItem.map((item, index) => {
        proNum += Number(item.fee);
      });
      setTotal(num + proNum);
    },
    printEvent: function () {
      var text = document.getElementById("printPage");
      window.print(text);
    },
    sendEvent: function () {
      setThisStep("two");
      setTimeout(() => {
        handleEvent.printEvent();
      }, 1000);
    },
  };

  useEffect(() => {

    handleAPI.getList()
  }, [])

  useEffect(() => { }, [isHavePro, isLoading, createProductItem, designerList, assistantList]);
  useEffect(() => {
    handleEvent.calTotal();
  }, [createServiceItem, total, createProductItem]);
  return (
    <>
      <Loading isLoading={isLoading} />
      <div id="printPage">
        <div
          className="container"
          style={
            thisStep == "one"
              ? { width: "500px" }
              : { width: "300px", fontSize: "24px" }
          }
        >
          <div className="row justify-content-center p-3">
            {/* <img src={require('../assets/image/logo.png')} style={{ width: '200px' }} /> */}
            <h1 className="text-center">Na Mi 沙龍</h1>
            <p className="text-end mt-3" style={{ fontSize: "18px" }}>
              {moment().format("YYYY/MM/DD HH:mm:ss")}
            </p>
            {thisStep == "one" && (
              <>
                <div className="mb-3">
                  <div className="row g-0 align-items-center">
                    <div className="col-2">
                      <label for="designer" className="col-form-label">
                        設計師
                      </label>
                    </div>
                    <div className="col-auto">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(e) =>
                          setPersonnelData({
                            ...personnelData,
                            owner: e.target.value,
                          })
                        }
                      >
                        <option selected disabled>
                          請選擇設計師
                        </option>
                        {designerList.map((item, index) => {
                          return <option value={item}>{item}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="row g-0 align-items-center mt-2">
                    <div className="col-2">
                      <label for="designer" className="col-form-label">
                        助理
                      </label>
                    </div>
                    <div className="col-auto">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(e) =>
                          setPersonnelData({
                            ...personnelData,
                            assistant: e.target.value,
                          })
                        }
                      >
                        <option selected disabled>
                          請選擇助理
                        </option>
                        {assistantList.map((item, index) => {
                          return <option value={item}>{item}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="row g-0 align-items-center mt-2">
                    <div className="col-2">
                      <label for="customer" className="col-form-label">
                        顧客
                      </label>
                    </div>
                    <div className="col-auto">
                      <input
                        type="text"
                        id="customer"
                        className="form-control"
                        onChange={(e) =>
                          setPersonnelData({
                            ...personnelData,
                            customer: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <hr />
                {createServiceItem.map((item, index) => {
                  return (
                    <div className="row g-2 align-items-center">
                      <div className="col-9">
                        {
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) =>
                              handleEvent.chooseServiceItem(
                                item.id,
                                e,
                                "service"
                              )
                            }
                          >
                            <option selected disabled>
                              請選擇服務項目
                            </option>
                            {serviceItem.map((item, index) => {
                              return (
                                <option
                                  value={`${item.itemName}-${item.fee}-${item.isHaveFee}`}
                                >
                                  {item.itemName} {item.fee?`$${item.fee}`:''}
                                </option>
                              );
                            })}
                          </select>
                        }
                      </div>
                      <div className="col-3 text-end">
                        <div className="d-flex align-items-center">
                          {item.isHaveFee == "false" ? (
                            <input
                              type="text"
                              className="form-control text-end fw-bolder"
                              onChange={(e) =>
                                handleEvent.setFee(item.id, e, "service")
                              }
                            />
                          ) : (
                            <p className="m-0">{toCurrency(item.fee)}</p>
                          )}
                          <a
                            href="#"
                            onClick={(e) =>
                              handleEvent.delItem(e, item.id, "service")
                            }
                          >
                            <FontAwesomeIcon
                              icon={faTimes}
                              style={{ fontSize: "18px" }}
                              className="mx-2 text-danger"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <a
                  href="#"
                  className="text-center fs-5 text-primary py-3"
                  onClick={(e) => handleEvent.addItem(e, "service")}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                </a>
                {/*  */}
                <hr />
                <div>
                  <div className="d-flex">
                    <p className="me-2">是否有購買產品</p>
                    <div class="form-check mx-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        onClick={(e) => (
                          setIsHavePro(true),
                          createProductItem.length == 0 &&
                          setCreateProductItem([
                            ...createProductItem,
                            { id: 1, itemName: "", fee: "" },
                          ])
                        )}
                        checked={isHavePro && "checked"}
                      />
                      <label
                        class="form-check-label"
                        htmlFor="flexRadioDefault1"
                      >
                        是
                      </label>
                    </div>
                    <div class="form-check mx-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onClick={(e) => (
                          setIsHavePro(false), setCreateProductItem([])
                        )}
                        checked={isHavePro == false && "checked"}
                      />
                      <label
                        class="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        否
                      </label>
                    </div>
                  </div>
                </div>
                {isHavePro && (
                  <div className="my-2">
                    {createProductItem.map((item, index) => {
                      return (
                        <div className="row g-2 align-items-center mb-2">
                          <div className="col-9">
                            {
                              <input
                                type="text"
                                className="form-control fw-bolder"
                                onChange={(e) =>
                                  handleEvent.chooseServiceItem(
                                    item.id,
                                    e,
                                    "product"
                                  )
                                }
                              />
                            }
                          </div>
                          <div className="col-3 text-end">
                            <div className="d-flex align-items-center">
                              <input
                                type="text"
                                className="form-control text-end fw-bolder"
                                onChange={(e) =>
                                  handleEvent.setFee(item.id, e, "product")
                                }
                              />
                              <a
                                href="#"
                                onClick={(e) =>
                                  handleEvent.delItem(e, item.id, "product")
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  style={{ fontSize: "18px" }}
                                  className="mx-2 text-danger"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="text-center mt-2">
                      <a
                        href="#"
                        className="text-center fs-5 text-primary py-3"
                        onClick={(e) => handleEvent.addItem(e, "product")}
                      >
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </a>
                    </div>
                  </div>
                )}
                <hr />
                <div className="pb-3">
                  <div className="d-flex justify-content-between fw-bolder">
                    <p>小計</p>
                    <p>{toCurrency(total)}</p>
                  </div>
                </div>
                <div className="text-center mb-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleEvent.sendEvent}
                  >
                    送出
                  </button>
                </div>
              </>
            )}
            {thisStep == "two" && (
              <>
                <div className="pb-1">
                  <p className="m-0">設計師：{personnelData.owner}</p>
                  <p className="m-0">助理：{personnelData.assistant}</p>
                  <p className="m-0">顧客：{personnelData.customer}</p>
                </div>
                <div>
                  <ul className="mt-2 border-2 border-top pt-2 list-unstyled">
                    <li className="small" style={{ fontSize: "18px" }}>
                      服務：
                    </li>
                    {createServiceItem.map((item, index) => {
                      return (
                        <li className="d-flex justify-content-between">
                          <p>◆ {item.itemName}</p>
                          <p>{toCurrency(item.fee)}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {
                  isHavePro == true &&
                  <div>
                    <ul className="mt-2 border-2 border-top pt-2 list-unstyled">
                      <li className="small" style={{ fontSize: "18px" }}>
                        產品：
                      </li>
                      {
                        createProductItem.map((item, index) => {
                          return (
                            <li className="d-flex justify-content-between">
                              <p>◆ {item.itemName}</p>
                              <p>{toCurrency(item.fee)}</p>
                            </li>
                          );
                        })
                      }
                    </ul>
                  </div>
                }
                {isHavePro && <div style={{ height: "0px" }}></div>}
                {/* <hr /> */}
                <div className="d-flex justify-content-between border-2 border-top pt-2">
                  <p>小計</p>
                  <p>{toCurrency(total)}</p>
                </div>
              </>
            )}
            <p className="small text-center mt-2" style={{ fontSize: "14px" }}>
              Copyright © 2022 NaMi Hair Salon. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      {thisStep == "two" && (
        <div className="text-center">
          <button
            className="btn btn-primary mx-1"
            onClick={(e) => window.location.reload()}
          >
            返回
          </button>
          <button
            className="btn btn-primary mx-1"
            onClick={(e) => handleEvent.printEvent()}
          >
            列印
          </button>
        </div>
      )}
    </>
  );
};
export default HomePage;
