"use client";
import { useCart } from "@/components/CartContext";
import MenuCard from "@/components/MenuCard";
import { useNotification } from "@/components/useNotification";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const { addToCart } = useCart();
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("API lỗi hoặc chưa chạy!");
        return res.json();
      })
      .then(setMenu)
      .catch((err) => {
        console.error("Lỗi fetch API:", err);
        showNotification(`Lỗi: Không thể lấy menu`, "error");
      });
  }, []);

  const handleAddToCart = (item: any) => {
    try {
      addToCart(item);
      showNotification(`${item.name} đã được thêm vào giỏ hàng!`, "success");
    } catch (err) {
      showNotification(`Lỗi: Không thể thêm ${item.name} vào giỏ!`, "error");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <NotificationComponent></NotificationComponent>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
        🍔 Our Menu
      </h1>

      {/* Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menu &&
          menu.map((menuItem) => (
            <MenuCard
              key={menuItem.id}
              id={menuItem.id}
              name={menuItem.name}
              price={menuItem.price}
              images={menuItem.images}
              onAddToCart={() => handleAddToCart(menuItem)}
            />
          ))}
      </div>

      {/* <div>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACkCAYAAAAZtYVBAAAAAklEQVR4AewaftIAAAYPSURBVO3BQQ4kt5bAQFKo+1+Z00v9jYBEVrVlz4uwPxjjEosxLrIY4yKLMS6yGOMiizEushjjIosxLrIY4yKLMS6yGOMiizEushjjIosxLrIY4yKLMS7y4SWVv6niRGVXcaKyq3hCZVexUzmp2KnsKnYqu4oTlb+p4o3FGBdZjHGRxRgX+fBlFd+kchOVXcUTFW9U7FR2FScV36TyTYsxLrIY4yKLMS7y4cdUnqh4QuWXVN6ouJnKExW/tBjjIosxLrIY4yIf/mMqdiq7il3FScUbKruKk4qdyknFf8lijIssxrjIYoyLfPiPUTlR2VWcqLxRcaKyq9hV7FR2KruKf7PFGBdZjHGRxRgX+fBjFTdT2VWcVJyonKjsKk5UdhU7lTcqbrIY4yKLMS6yGOMiH75M5Z9UsVPZVexU3lDZVexUdhU7lV3FL6ncbDHGRRZjXGQxxkU+vFRxE5VdxU5lV/FLFTuVE5UTlV3FScW/yWKMiyzGuMhijIt8eEllV7FT+aaKXcU3qbyhsqt4omKnsqvYqewqdirfVPFLizEushjjIosxLvLhMhW/VLFTOak4qdip7FROKnYqJyq7iicqTlSeUNlVvLEY4yKLMS6yGOMiH36sYqeyqzhR2VXsVHYVO5WTip3KTuWk4qTimyp2KruKXcWJyq5ip7JT2VV802KMiyzGuMhijIvYH7ygsqt4QmVXcaLyRMVO5YmKE5UnKk5UTiqeUNlV7FSeqNip7CreWIxxkcUYF1mMcRH7gxdUTiqeUHmiYqeyqzhR2VXsVJ6o+CaVJyqeUDmp2KnsKr5pMcZFFmNcZDHGRT58WcUTKicV36Syq9ip7Cp2KruKncpJxYnKrmKnsqvYqTxRcaJyorKreGMxxkUWY1xkMcZF7A9eUPmbKnYqv1SxUzmpeEJlV/GGyknFTmVXcaKyq/imxRgXWYxxkcUYF/nwZRU7lV3FN1XsVHYVO5VdxU7liYonVHYVO5U3Kk5UdhU7lZOKX1qMcZHFGBdZjHER+4MXVE4qTlR2FTuVJyqeUPmlihOVXcVOZVexUzmp2KmcVDyhsqt4YzHGRRZjXGQxxkU+XK5ip3KisqvYqZxUfJPKScVO5URlV3GiclKxU/knLca4yGKMiyzGuMiHL6t4omKnclJxonJScaLyRsVJxRMV31SxU9lV7FR2Fb+0GOMiizEushjjIh9eqtipnFScVJyo7Cq+qWKnsqvYqZxUvKGyq9ipnFQ8ofKEyq7ijcUYF1mMcZHFGBf58JLKGypvqOwqdiq7ip3KruKJihOVXcVJxRsVJypPVOxUdhXftBjjIosxLrIY4yL2By+o7CpupvJExU7lpOJE5ZsqdionFU+o7Cp2KruKNxZjXGQxxkUWY1zkw4+p7CpOVE4qTlS+SWVX8UbFicpJxRsqb6jsKr5pMcZFFmNcZDHGRT78WMUTFU+o7CqeUDmpOFHZVZyoPFGxU3mj4gmVE5VdxRuLMS6yGOMiizEu8uEvU3mj4gmVXcU3VexUdhW7ip3KruKkYqfyhMoTFX/TYoyLLMa4yGKMi9gf/Iup7CreUDmpOFF5omKnclKxU9lVPKGyq9ip7Cp2KruKNxZjXGQxxkUWY1zkw0sqf1PFruIJlZOKncpO5YmKE5VdxYnKEyq7ijdUdhXftBjjIosxLrIY4yIfvqzim1ROVE4qdhV/k8pJxU7lmyr+TRZjXGQxxkUWY1zkw4+pPFHxT1J5o+KNiidUdipvqOwqdiq/tBjjIosxLrIY4yIf/p9ROak4UdlV7FTeqNipnFTsVHYVO5WTip3Kicqu4o3FGBdZjHGRxRgX+TD+h8qu4kTlpOJE5aTiRGVXsVM5qXii4pcWY1xkMcZFFmNc5MOPVfxSxU7liYqdyk7lpOJE5QmVXcVJxUnFTmWncpPFGBdZjHGRxRgX+fBlKn+TyhMVJxUnKjuVk4oTlV3FicoTFU9UnKjsKr5pMcZFFmNcZDHGRewPxrjEYoyLLMa4yGKMiyzGuMhijIssxrjIYoyLLMa4yGKMiyzGuMhijIssxrjIYoyLLMa4yGKMi/wfHwz3RZLkMcQAAAAASUVORK5CYII=" alt="QR Code" />
        <a href="data:image/png;base64,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" download="qrcode.png">Tải mã QR</a>
      </div> */}

      {/* Hiển thị khi menu trống */}
      {menu.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          🍽️ Không có món nào trong menu
        </p>
      )}
    </div>
  );
}
