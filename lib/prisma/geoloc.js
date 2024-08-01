import prisma from ".";

export async function getGeoLocs(type) {
  try {
    let res 
      if (type == ""){
        res = await prisma.geoLocation.findMany({
          include: {
              geodatas: {
                orderBy: [
                  {
                      rating: 'desc', // Order by rating in descending order
                  },
                  {
                      reviews: 'desc', // Then order by reviews in descending order
                  }
              ]
              }, // Include all geodatas without filtering
              _count: {
                select: {
                  geodatas: true // Count all geodatas without filtering
                }
              }
          }
      })
      }else{
        res = await prisma.geoLocation.findMany({
          include: {
              geodatas: {
                where: {
                  type: type,
              },
                orderBy: [
                  {
                      rating: 'desc', // Order by rating in descending order
                  },
                  {
                      reviews: 'desc', // Then order by reviews in descending order
                  }
              ]
              }, // Include all geodatas without filtering
              _count: {
                select: {
                  geodatas: {
                    where:{
                      type: type
                    }
                  }
                }
              }
          }
      })
      }
      return { res };
  } catch (error) {
      return { error };
  }
}

// export async function getGeoLocs(cafeResto) {
//   try {
//       const res = await prisma.geoLocation.findMany({
//           include: {
//               geodatas: {
//                   where: {
//                       cafe_resto: cafeResto,
//                   }
//               },
//               _count:{
//                 select:{
//                   geodatas:{
//                     where:{
//                       cafe_resto: cafeResto,
//                     }
//                   }
//                 }
//               }
//           }
//       })
//       return { res };
//   } catch (error) {
//       return { error };
//   }
// }

export async function findGeoCompByPoint(lat, lng) {
  try {
    const res = await prisma.geoLocation.findRaw({
      filter: {
        "geojs.geometry": {
          $geoIntersects: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
          },
        },
      },
    });
    return { res };
  } catch (error) {
    return { error };
  }
}