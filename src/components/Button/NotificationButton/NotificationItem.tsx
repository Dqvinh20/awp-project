function NotificationItem() {
  return (
    <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-100 -mx-2">
      <img
        className="h-8 w-8 rounded-full object-cover mx-1"
        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=398&q=80"
        alt="avatar"
      />
      <p className="text-gray-600 text-sm mx-2">
        <span className="font-bold" href="#">
          Abigail Bennett
        </span>{' '}
        start following you . 3h
      </p>
    </a>
  );
}

export default NotificationItem;
