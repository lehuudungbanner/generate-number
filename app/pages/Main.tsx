"use client";
import React, { useState } from "react";
import {
  Button,
  InputNumber,
  List,
  notification,
  Space,
  Typography,
} from "antd";

const MAX_NUMBER = 5;
const Main: React.FC = () => {
  const [numberLength, setNumberLength] = useState(0);
  const [totalFirst, setTotalFirst] = useState(0);
  const [totalLast, setTotalLast] = useState(0);
  const [firstNumberLength, setFirstNumberLength] = useState(0);
  const [lastNumberLength, setLastNumberLength] = useState(0);
  const [prefix, setPrefix] = useState(0);
  const [suffix, setSuffix] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);

  const [isLoadingMore, setLoadingMore] = useState(true);

  const [api, contextHolder] = notification.useNotification();

  const validate = (): string => {
    if (
      numberLength === 0 ||
      !firstNumberLength ||
      !numberLength ||
      !lastNumberLength ||
      firstNumberLength === 0 ||
      lastNumberLength === 0 ||
      !totalFirst ||
      !totalLast ||
      !prefix ||
      !suffix
    )
      return "Hãy nhập đủ các trường ";
    const totalFirstNumber = totalFirst - calculateTotal(prefix?.toString());
    const totalLastNumber = totalLast - calculateTotal(suffix?.toString());
    if (totalFirstNumber < 0 || totalLastNumber < 0)
      return "Giá trị bắt đầu/ kết thúc phải nhỏ hơn tổng chữ số đầu/cuối";
    if (numberLength > 12) return "Tổng số chữ số	nhỏ hơn 12 số";
    if (numberLength === 0) return "Tổng số chữ số > 0";
    if (totalFirst > firstNumberLength * 9)
      return `Tổng chữ số đầu phải nhỏ hơn ${firstNumberLength * 9}`;
    if (totalLast > lastNumberLength * 9)
      return `Tổng chữ số đầu phải nhỏ hơn ${lastNumberLength * 9}`;

    return "";
  };

  const calculateTotal = (str: string): number => {
    let total = 0;
    for (const character of str) {
      total += parseInt(character, 10);
    }
    return total;
  };

  const backtrack = (
    maxLength: any,
    subNumber: string,
    resultList: string[],
    size: any
  ): string => {
    if (subNumber.length === maxLength) return subNumber;
    if (resultList.length === size) return "";

    for (let i = 1; i <= 9; i++) {
      subNumber += i;
      let result = backtrack(maxLength, subNumber, resultList, size);
      result = prefix + result + suffix;
      const firstNumberString = result.substring(0, firstNumberLength);
      const lastNumberString = result.substring(
        result.length - lastNumberLength
      );
      if (
        calculateTotal(firstNumberString) === totalFirst &&
        calculateTotal(lastNumberString) === totalLast &&
        !results.includes(result)
      ) {
        resultList.push(result);
      }
      subNumber = subNumber.substring(0, subNumber.length - 1);
    }
    return "";
  };

  const generateNumbers = async (): Promise<any> => {
    const msgError = validate();
    if (msgError.length > 0) {
      openNotification(msgError);
      return;
    }
    setResults([]);
    setLoadingMore(true);

    const midNumberLength =
      numberLength - prefix.toString().length - suffix.toString().length;
    const resultList = [] as string[];

    await backtrack(midNumberLength, "", resultList, MAX_NUMBER);

    setResults([...resultList]);
  };

  const renderItem = (item: any) => {
    return (
      <List.Item>
        <Typography.Text mark></Typography.Text> {item}
      </List.Item>
    );
  };

  const onLoadMore = async (): Promise<any> => {
    const msgError = validate();
    if (msgError.length > 0) {
      openNotification(msgError);
      return;
    }

    const midNumberLength =
      numberLength - prefix.toString().length - suffix.toString().length;
    const resultList = [] as string[];
    await backtrack(midNumberLength, "", resultList, MAX_NUMBER);
    if (resultList.length > 0) {
      setResults([...results, ...resultList]);
    } else {
      setLoadingMore(false);
    }
  };

  const loadMore = !isLoading && isLoadingMore && results.length > 0 && (
    <div
      style={{
        textAlign: "center",
        marginTop: 12,
        height: 32,
        lineHeight: "32px",
      }}
    >
      <Button onClick={onLoadMore}>Thêm</Button>
    </div>
  );

  const openNotification = (msg: string) => {
    api.error({
      message: msg,
      description: "",
      placement: "topLeft",
    });
  };

  return (
    <div>
      <Space
        direction="vertical"
        className="flex flex-col justify-center items-start"
      >
        <InputNumber
          addonBefore="Tổng số chữ số"
          value={numberLength}
          className="w-full"
          onChange={(value: any) => setNumberLength(value)}
        />
        <div className="flex flex-row gap-10">
          <div className="flex flex-col gap-2">
            <div className="text-lg mt-3">Thiết lập các chữ số đầu </div>
            <InputNumber
              addonBefore="Số chữ số đầu"
              value={firstNumberLength}
              onChange={(value: any) => {
                setFirstNumberLength(value);
                if (numberLength > value) {
                  setLastNumberLength(numberLength - value);
                } else {
                }
              }}
            />
            <InputNumber
              addonBefore="Tổng số chữ số đầu"
              value={totalFirst}
              onChange={(value: any) => setTotalFirst(value)}
            />
            <InputNumber
              addonBefore="Bắt đầu với"
              value={prefix}
              onChange={(value: any) => setPrefix(value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg mt-3">Thiết lập các chữ số cuối</div>
            <InputNumber
              addonBefore="Số chữ số cuối "
              value={lastNumberLength}
              onChange={(value: any) => setLastNumberLength(value)}
              disabled={true}
            />
            <InputNumber
              addonBefore="Tổng số chữ số cuối"
              value={totalLast}
              onChange={(value: any) => setTotalLast(value)}
            />
            <InputNumber
              addonBefore="Kết thúc với"
              value={suffix}
              onChange={(value: any) => setSuffix(value)}
            />
          </div>
        </div>
        <Button
          type="primary"
          className="w-50 mt-3"
          onClick={async () => {
            setResults([]);
            setLoading(true);
            generateNumbers();
            setLoading(false);
          }}
        >
          Tạo danh sách
        </Button>
      </Space>
      <List
        bordered
        dataSource={results}
        renderItem={renderItem}
        className="mt-10 max-h-[300px] overflow-auto"
        loading={isLoading}
        loadMore={loadMore}
      />
      {contextHolder}
    </div>
  );
};

export default Main;
