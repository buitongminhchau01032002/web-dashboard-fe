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
import { toast } from 'react-toastify';
import HeaderCell from '../../../components/Table/HeaderCell';
import { useEffect, useMemo, useState } from 'react';
import PriceFormat from '../../../components/PriceFormat';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import PriceInput from '../../../components/PriceInput';
import { orderActions } from '../../../redux/slices/orderSlice';
import LoadingForm from '../../../components/LoadingForm';

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
        header: (props) => <HeaderCell tableProps={props}>Sản phẩm</HeaderCell>,
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

function PhoneGroup({ setIsValid, setValue, customers }) {
    const [customer, setCustomer] = useState(null);
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
        const _customer = customers.find((c) => c.phone === form.values.phone);
        setCustomer(_customer);
        setValue(form.values.phone, _customer);
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
            {customer && (
                <div className="mt-2 flex items-center space-x-2">
                    <img
                        src={customer.avatar || '/placeholder.png'}
                        className="h-10 w-10 rounded-full border object-cover"
                    />
                    <p className="flex-1">{customer.name}</p>
                </div>
            )}
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

function DeliveryGroup({ isDelivered, setIsDelivered, setIsValid, setValue, infoValue }) {
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
                    <div className="flex items-center space-x-3">
                        <label className="label" htmlFor="address">
                            Địa chỉ giao hàng *
                        </label>
                        {infoValue?.customer && (
                            <button
                                className="font-semibold text-blue-600 hover:text-blue-700"
                                onClick={() =>
                                    form.setFieldValue('address', infoValue.customer.address)
                                }
                            >
                                Mặc định
                            </button>
                        )}
                    </div>
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

function PaymentGroup({
    isDelivered,
    isPaid,
    setIsPaid,
    setIsValid,
    totalPrice,
    intoMoney,
    setValue,
}) {
    const [receivedMoney, setReceivedMoney] = useState(0);
    const exchangeMoney = receivedMoney - intoMoney;

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
                <div className="mt-4 flex space-x-6">
                    <div className="space-y-1">
                        <p className="">
                            <span>Tổng giá: </span>
                            <span className="text-xl font-semibold text-blue-600">
                                <span>
                                    <PriceFormat>{totalPrice}</PriceFormat>
                                </span>
                                <span> VNĐ</span>
                            </span>
                        </p>

                        <p className="">
                            <span>Giảm giá: </span>
                            <span className="text-xl font-semibold text-green-600">
                                <span>
                                    <PriceFormat>{totalPrice - intoMoney}</PriceFormat>
                                </span>
                                <span> VNĐ</span>
                            </span>
                        </p>

                        <p className="">
                            <span>Thành tiền: </span>
                            <span className="text-xl font-bold text-blue-600">
                                <span>
                                    <PriceFormat>{intoMoney}</PriceFormat>
                                </span>
                                <span> VNĐ</span>
                            </span>
                        </p>
                    </div>
                    <div className="border-l"></div>

                    <div className="space-y-1">
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

                        <div className="">
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
                </div>
            )}
        </div>
    );
}

function CouponGroup({ infoValue, setValue, coupons }) {
    const [couponName, setCouponName] = useState('');
    useEffect(() => {
        const coupon = coupons.find((c) => c.name === couponName);
        setValue(coupon || null);
    }, [couponName]);

    useEffect(() => {
        setCouponName('');
    }, [infoValue?.customer]);

    return (
        infoValue?.customer && (
            <div className="mb-4 flex space-x-3">
                <div className="w-[200px]">
                    <label className="label" htmlFor="coupon">
                        Mã giảm giá
                    </label>
                    <input
                        type="text"
                        id="coupon"
                        className={clsx('text-input')}
                        value={couponName}
                        onChange={(e) => setCouponName(e.target.value)}
                    />
                </div>
                {infoValue.coupon && (
                    <div
                        className={clsx('flex-1 rounded border px-4 py-2', {
                            'border-green-600': infoValue.coupon.canUse,
                            'border-gray-300 bg-gray-100': !infoValue.coupon.canUse,
                        })}
                    >
                        <p className="font-medium text-gray-700">{infoValue.coupon.description}</p>
                        <div className="flex space-x-3">
                            <div className="space-x-1">
                                <span className="text-gray-600">Giảm:</span>
                                <span className="font-bold text-green-600">
                                    {infoValue.coupon.discountPercent + '%'}
                                </span>
                            </div>

                            {infoValue.coupon.canUse ? (
                                <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                    Có thể dùng
                                </div>
                            ) : (
                                <div className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                                    Hết lượt dùng
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    );
}

function InfoGroup({ totalPrice, intoMoney, setValue, setIsValid, customers, coupons, infoValue }) {
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
                setValue={(phone, customer) =>
                    setValue((prev) => ({
                        ...prev,
                        phone,
                        customer,
                    }))
                }
                customers={customers}
            />
            <CouponGroup
                coupons={coupons}
                infoValue={infoValue}
                setValue={(coupon) =>
                    setValue((prev) => ({
                        ...prev,
                        coupon,
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
                infoValue={infoValue}
            />
            <PaymentGroup
                isDelivered={isDelivered}
                isPaid={isPaid}
                setIsPaid={setIsPaid}
                setIsValid={setIsPaidValid}
                totalPrice={totalPrice}
                intoMoney={intoMoney}
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
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [coupons, setCounpons] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/customer')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setCustomers(resJson.customers);
                } else {
                    setCustomers([]);
                }
            })
            .catch((error) => {
                console.log(error);
                setCustomers([]);
            });
    }, []);

    const dispatch = useDispatch();
    const [isValidInfo, setIsValidInfo] = useState(false);
    const [infoValue, setInfoValue] = useState({
        phone: '',
        isDelivered: true,
        isPaid: true,
        receivedMoney: 0,
        customer: null,
        coupon: null,
    });

    useEffect(() => {
        if (infoValue?.customer) {
            fetch('http://localhost:5000/api/coupon/get-by-customer/' + infoValue.customer?._id)
                .then((res) => res.json())
                .then((resJson) => {
                    if (resJson.success) {
                        setCounpons(resJson.coupons);
                    } else {
                        setCounpons([]);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setCounpons([]);
                });
        }
        setInfoValue((prev) => ({
            ...prev,
            coupon: null,
        }));
    }, [infoValue?.customer]);

    const intoMoney = useMemo(() => {
        if (!infoValue?.coupon) {
            return order?.totalPrice;
        }
        if (!infoValue.coupon?.canUse) {
            return order?.totalPrice;
        }
        return order?.totalPrice - (order?.totalPrice * infoValue.coupon?.discountPercent) / 100;
    }, [infoValue?.coupon]);

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
        setLoading(true);
        const details = order.details.map((d) => ({
            productSize: d.productSize._id,
            quantity: d.quantity,
            price: d.price,
        }));
        fetch('http://localhost:5000/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId: infoValue.customer?._id,
                deliveryStatus: infoValue.isDelivered ? 'delivered' : 'pending',
                paymentStatus: infoValue.isPaid ? 'paid' : 'unpaid',
                details: details,
                receivedMoney: infoValue.isPaid
                    ? Number(infoValue.receivedMoney)
                    : order.totalPrice,
                totalPrice: order.totalPrice,
                intoMoney: intoMoney,
                coupon: infoValue.coupon?._id,
                exchangeMoney: infoValue.isPaid ? Number(infoValue.receivedMoney) - intoMoney : 0,
                phone: infoValue.phone,
                address: infoValue.isDelivered ? null : infoValue.address,
            }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    dispatch(orderActions.reset());
                    toast.success('Tạo đơn hàng thành công');
                } else {
                    toast.error('Có lỗi xảy ra');
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error('Có lỗi xảy ra');
            })
            .finally(() => {
                close();
                setLoading(false);
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
                        <p className="mt-5 text-right font-semibold">
                            <span>Tổng tiền: </span>
                            <span className="text-xl text-blue-600">
                                <span>
                                    <PriceFormat>{order?.totalPrice}</PriceFormat>
                                </span>
                                <span> VNĐ</span>
                            </span>
                        </p>
                    </div>

                    {/* INFOR */}
                    <div className="flex-1">
                        {/* CUSTOMER FORM */}
                        <div className="relative">
                            <InfoGroup
                                totalPrice={order?.totalPrice}
                                intoMoney={intoMoney}
                                setValue={setInfoValue}
                                setIsValid={setIsValidInfo}
                                customers={customers}
                                infoValue={infoValue}
                                coupons={coupons}
                            />
                            <LoadingForm loading={loading} />
                        </div>

                        <div className="mt-4 flex justify-between">
                            <div className="flex justify-end">
                                <button className="btn btn-blue btn-md" onClick={() => close()}>
                                    Quay lại
                                </button>
                                <button
                                    className="btn btn-yellow btn-md"
                                    disabled={!isValidInfo || loading}
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
