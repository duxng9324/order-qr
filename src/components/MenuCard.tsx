interface MenuCardProps {
    id: string | number,
    name: string,
    price: number,
    images? : string[],
}

export default function MenuCard({ id, name, price, images }: MenuCardProps) {
  return (
    <div
      key={id}
      className="card bg-white shadow-xl hover:scale-105 transition transform duration-200"
    >
      <figure>
        <img
          src={images?.[0] || "/placeholder.jpg"}
          alt={name}
          className="h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h3 className="card-title text-lg font-semibold">{name}</h3>
        <p className="text-orange-600 font-semibold">{price.toLocaleString()}₫</p>
      </div>
    </div>
  );
}