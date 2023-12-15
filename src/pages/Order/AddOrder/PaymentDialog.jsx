import clsx from 'clsx';
import Table from '../../../components/Table';
import Pagination from '../../../components/Table/Pagination';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import HeaderCell from '../../../components/Table/HeaderCell';
import { useEffect, useMemo, useState } from 'react';
import PriceFormat from '../../../components/PriceFormat';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import PriceInput from '../../../components/PriceInput';

function NameAndImageCell({ row, getValue }) {
    const image = row.getValue('image');
    return (
        <div className="flex items-center space-x-2">
            <img
                src={image || '/placeholder.png'}
                className="h-10 w-10 rounded-full border object-cover"
            />
            <p className="flex-1">{getValue()}</p>
        </div>
    );
}

const columns = [
    {
        accessorKey: 'id',
        header: (props) => (
            <HeaderCell align="center" tableProps={props}>
                Mã
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className="text-center">{getValue()}</p>,
        size: 80,
    },
    {
        accessorKey: 'name',
        header: (props) => <HeaderCell tableProps={props}>Tên</HeaderCell>,
        cell: NameAndImageCell,
        size: 'full',
    },
    {
        accessorKey: 'size',
        header: (props) => (
            <HeaderCell align="center" tableProps={props}>
                Size
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className="text-center">{getValue()}</p>,
        size: 80,
    },
    {
        accessorKey: 'price',
        header: (props) => (
            <HeaderCell align="right" tableProps={props}>
                Giá
            </HeaderCell>
        ),
        cell: ({ getValue }) => (
            <p className="text-right">
                <PriceFormat>{getValue()}</PriceFormat>
            </p>
        ),
        size: 100,
    },
    {
        accessorKey: 'orderQuantity',
        header: (props) => (
            <HeaderCell align="right" tableProps={props}>
                SL
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className="text-right">{getValue()}</p>,
        size: 80,
    },
    {
        accessorKey: 'image',
    },
];

function PhoneGroup({ setIsValid, setValue }) {
    const validationSchema = Yup.object({
        phone: Yup.string()
            .required('Trường này bắt buộc')
            .matches(/^[\+|0]([0-9]{9,14})\b/, 'Số điện thoại không hợp lệ'),
    });

    const form = useFormik({
        initialValues: {
            phone: '',
        },
        validationSchema,
        onSubmit: () => {},
        validateOnChange: true,
        validateOnMount: true,
    });

    useEffect(() => {
        setValue(form.values.phone);
    }, [form.values.phone]);

    useEffect(() => {
        if (form.errors?.phone) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [form.errors]);

    return (
        <div>
            <label className="label" htmlFor="phone">
                Số điện thoại *
            </label>
            <input
                type="text"
                id="phone"
                className={clsx('text-input', {
                    invalid: form.touched.phone && form.errors.phone,
                })}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                value={form.values.phone}
                name="phone"
            />
            <span
                className={clsx('text-sm text-red-500 opacity-0', {
                    'opacity-100': form.touched.phone && form.errors.phone,
                })}
            >
                {form.errors.phone || 'No message'}
            </span>
        </div>
    );
}

function DeliveryGroup({ isDelivered, setIsDelivered, setIsValid, setValue }) {
    const validationSchema = Yup.object({
        address: Yup.string().required('Trường này bắt buộc'),
    });

    const form = useFormik({
        initialValues: {
            address: '',
        },
        validationSchema,
        onSubmit: () => {},
        validateOnChange: true,
        validateOnMount: true,
    });

    useEffect(() => {
        setValue(form.values.address);
    }, [form.values.address]);

    useEffect(() => {
        if (isDelivered) {
            setIsValid(true);
        } else {
            if (form.errors.address) {
                setIsValid(false);
            } else {
                setIsValid(true);
            }
        }
    }, [form.errors, isDelivered]);
    return (
        <div>
            <div className="flex items-center space-x-5">
                <div className="flex items-center">
                    <input
                        className="h-5 w-5 accent-blue-600"
                        type="radio"
                        id="de-1"
                        onChange={(e) => setIsDelivered(e.target.checked)}
                        checked={isDelivered}
                    />
                    <label htmlFor="de-1" className="cursor-pointer pl-2">
                        Nhận hàng ngay
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        className="h-5 w-5 accent-blue-600"
                        type="radio"
                        id="de-2"
                        onChange={(e) => setIsDelivered(!e.target.checked)}
                        checked={!isDelivered}
                    />
                    <label htmlFor="de-2" className="cursor-pointer pl-2">
                        Giao hàng
                    </label>
                </div>
            </div>

            {!isDelivered && (
                <div className="mt-2">
                    <label className="label" htmlFor="address">
                        Địa chỉ giao hàng *
                    </label>
                    <textarea
                        type="text"
                        id="address"
                        className={clsx('text-input !h-auto py-2', {
                            invalid: form.touched.address && form.errors.address,
                        })}
                        onChange={form.handleChange}
                        value={form.values.address}
                        onBlur={form.handleBlur}
                        name="address"
                        rows={2}
                    ></textarea>
                    <span
                        className={clsx('-mt-1 block text-sm text-red-500 opacity-0', {
                            'opacity-100': form.touched.address && form.errors.address,
                        })}
                    >
                        {form.errors.address || 'No message'}
                    </span>
                </div>
            )}
        </div>
    );
}

function PaymentGroup({ isDelivered, isPaid, setIsPaid, setIsValid, totalMoney, setValue }) {
    const [receivedMoney, setReceivedMoney] = useState(0);
    const exchangeMoney = receivedMoney - totalMoney;

    useEffect(() => {
        setValue(receivedMoney);
        if (!isPaid) {
            setIsValid(true);
        } else if (exchangeMoney < 0) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [exchangeMoney, isPaid]);
    useEffect(() => {
        if (isDelivered) {
            setIsPaid(true);
        }
    }, [isDelivered]);
    return (
        <div className="mt-3">
            <div className="flex items-center space-x-5">
                <div className="flex items-center">
                    <input
                        className="h-5 w-5 accent-blue-600"
                        type="radio"
                        id="pa-1"
                        onChange={(e) => setIsPaid(e.target.checked)}
                        checked={isPaid}
                    />
                    <label htmlFor="pa-1" className="cursor-pointer pl-2">
                        Thanh toán ngay
                    </label>
                </div>
                <div
                    className={clsx('flex items-center', {
                        'pointer-events-none opacity-60': isDelivered,
                    })}
                >
                    <input
                        className="h-5 w-5 accent-blue-600"
                        type="radio"
                        id="pa-2"
                        onChange={(e) => setIsPaid(!e.target.checked)}
                        checked={!isPaid}
                    />
                    <label htmlFor="pa-2" className="cursor-pointer pl-2">
                        Thanh toán sau
                    </label>
                </div>
            </div>

            {isPaid && (
                <div className="mt-4">
                    <div className="flex items-center">
                        <label className="mr-2" htmlFor="price">
                            Tiền nhận:
                        </label>
                        <PriceInput
                            id="order-payment-received-money"
                            value={receivedMoney}
                            onChange={(e) => setReceivedMoney(e.target.value)}
                            className="w-56"
                            placeholder="Tiền nhận"
                        />
                    </div>

                    <div className="mt-1">
                        <span>Tiền thừa: </span>
                        <span
                            className={clsx('text-xl font-semibold text-blue-600', {
                                'text-red-600': exchangeMoney < 0,
                            })}
                        >
                            <span>
                                <PriceFormat>{exchangeMoney}</PriceFormat>
                            </span>
                            <span> VNĐ</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoGroup({ totalMoney, setValue, setIsValid }) {
    const [isValidPhone, setIsValidPhone] = useState(false);
    const [isDelivered, setIsDelivered] = useState(true);
    const [isValidDelivered, setIsValidDelivered] = useState(true);
    const [isPaid, setIsPaid] = useState(true);
    const [isPaidValid, setIsPaidValid] = useState(false);

    useEffect(() => {
        setValue((prev) => ({
            ...prev,
            isDelivered,
            isPaid,
        }));
    }, [isDelivered, isPaid]);

    useEffect(() => {
        if (isValidPhone && isPaidValid && isValidDelivered) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [isValidPhone, isValidDelivered, isPaidValid]);

    return (
        <div>
            <PhoneGroup
                setIsValid={setIsValidPhone}
                setValue={(phone) =>
                    setValue((prev) => ({
                        ...prev,
                        phone,
                    }))
                }
            />
            <DeliveryGroup
                isDelivered={isDelivered}
                setIsDelivered={setIsDelivered}
                setIsValid={setIsValidDelivered}
                setValue={(address) =>
                    setValue((prev) => ({
                        ...prev,
                        address,
                    }))
                }
            />
            <PaymentGroup
                isDelivered={isDelivered}
                isPaid={isPaid}
                setIsPaid={setIsPaid}
                setIsValid={setIsPaidValid}
                totalMoney={totalMoney}
                setValue={(receivedMoney) =>
                    setValue((prev) => ({
                        ...prev,
                        receivedMoney,
                    }))
                }
            />
        </div>
    );
}

export default function PaymentDialog({ close, meta }) {
    const selectedProducts = meta?.selectedProducts;
    const order = meta?.order;
    const [isValidInfo, setIsValidInfo] = useState(false);
    const [infoValue, setInfoValue] = useState({
        phone: '',
        isDelivered: true,
        isPaid: true,
        receivedMoney: 0,
    });

    const table = useReactTable({
        data: selectedProducts,
        columns,
        state: {
            columnVisibility: { image: false },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {},
    });

    function createOrder() {
        console.log(infoValue);
        return;
        setLoading(true);
        fetch('http://localhost:5000/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...order,
                receivedMoney,
                exchangeMoney,
                discount,
            }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                setShowPaymentDialog(false);
                if (resJson.success) {
                    setLoading(false);
                    showSuccessNoti();
                    dispatch(orderActions.reset());
                    setReceivedMoney(0);
                } else {
                    setLoading(false);
                    showErorrNoti();
                }
            })
            .catch((error) => {
                console.log(error);
                setShowPaymentDialog(false);
                setLoading(false);
                showErorrNoti();
            });
    }
    return (
        <div
            className={clsx(
                'fixed inset-0 z-[99999] flex items-center justify-center bg-black/20 opacity-100 transition-opacity'
            )}
        >
            <div className="min-h-[600px] w-full max-w-[1400px] rounded-lg bg-white p-6">
                <div className=" text-center text-lg font-bold text-slate-900">
                    Thanh toán hoá đơn
                </div>
                <div className="mt-5 flex space-x-6">
                    {/* PRODUCT */}
                    <div className="mt-3 flex-1">
                        <Table
                            table={table}
                            notFoundMessage="Chưa có sản phẩm trong hoá đơn"
                            rowClickable={false}
                        />
                        <Pagination table={table} />
                    </div>

                    {/* INFOR */}
                    <div className="flex-1">
                        {/* CUSTOMER FORM */}
                        <InfoGroup
                            totalMoney={order.totalPrice + 100000}
                            setValue={setInfoValue}
                            setIsValid={setIsValidInfo}
                        />

                        <div className="mt-4 flex justify-between">
                            <div className="flex justify-end">
                                <button className="btn btn-blue btn-md" onClick={() => close()}>
                                    Quay lại
                                </button>
                                <button
                                    className="btn btn-yellow btn-md"
                                    disabled={!isValidInfo}
                                    onClick={() => createOrder()}
                                >
                                    Thanh toán hoá đơn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}