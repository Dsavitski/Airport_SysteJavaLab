package tests.services;

import com.example.demo.dto.FlightCreateDto;
import com.example.demo.dto.FlightDisplayDto;
import com.example.demo.entities.Flight;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.FlightMapper;
import com.example.demo.repository.FlightRepository;

import com.example.demo.service.FlightService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlightServiceTest {

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private FlightMapper flightMapper;

    @InjectMocks
    private FlightService flightService;

    private Flight flight;
    private FlightDisplayDto displayDto;
    private FlightCreateDto createDto;

    @BeforeEach
    void setup() {
        flight = new Flight();
        flight.setId(1L);

        displayDto = new FlightDisplayDto();
        createDto = new FlightCreateDto();
    }

    @Test
    void createFlight_success_andInvalidateCache() {
        when(flightMapper.toEntity(createDto)).thenReturn(flight);
        when(flightRepository.save(flight)).thenReturn(flight);
        when(flightMapper.toDisplayDTO(flight)).thenReturn(displayDto);

        FlightDisplayDto result = flightService.createFlight(createDto);

        assertNotNull(result);
        verify(flightRepository).save(flight);
        verify(flightMapper).toDisplayDTO(flight);
    }

    @Test
    void getAllFlights_success() {
        when(flightRepository.findAll()).thenReturn(List.of(flight));
        when(flightMapper.toDisplayDTO(flight)).thenReturn(displayDto);

        List<FlightDisplayDto> result = flightService.getAllFlights();

        assertEquals(1, result.size());
        verify(flightMapper).toDisplayDTO(flight);
    }

    @Test
    void getAllFlightsWithJoinFetch_success() {
        when(flightRepository.findAllWithFetchJoin()).thenReturn(List.of(flight));

        List<Flight> result = flightService.getAllFlightsWithJoinFetch();

        assertEquals(1, result.size());
        verify(flightRepository).findAllWithFetchJoin();
    }

    @Test
    void findByFlightNumberAndDepartureDate_cacheHit() {
        String number = "SU100";
        LocalDate date = LocalDate.now();
        String passport = "123";

        when(flightRepository.findFlightByDetailsAndPassport(number, date, passport))
            .thenReturn(Optional.of(flight));
        when(flightMapper.toDisplayDTO(flight)).thenReturn(displayDto);

        flightService.findByFlightNumberAndDepartureDate(number, date, passport);

        FlightDisplayDto result =
            flightService.findByFlightNumberAndDepartureDate(number, date, passport);

        assertNotNull(result);
        verify(flightRepository, times(1))
            .findFlightByDetailsAndPassport(number, date, passport);
    }

    @Test
    void findByFlightNumberAndDepartureDate_dbHit() {
        when(flightRepository.findFlightByDetailsAndPassport(any(), any(), any()))
            .thenReturn(Optional.of(flight));
        when(flightMapper.toDisplayDTO(flight)).thenReturn(displayDto);

        FlightDisplayDto result =
            flightService.findByFlightNumberAndDepartureDate("SU1", LocalDate.now(), "P1");

        assertNotNull(result);
    }

    @Test
    void findByFlightNumberAndDepartureDate_notFound() {
        when(flightRepository.findFlightByDetailsAndPassport(any(), any(), any()))
            .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> {flightService.findByFlightNumberAndDepartureDate("SU1", LocalDate.now(), "P1");});
    }

    @Test
    void findFlightByDetailsAndPassportNative_cacheHit() {
        String number = "SU200";
        LocalDate date = LocalDate.now();
        String passport = "321";

        when(flightRepository.findFlightByDetailsAndPassportNative(number, date, passport))
            .thenReturn(Optional.of(flight));
        when(flightMapper.toDisplayDTO(flight)).thenReturn(displayDto);

        flightService.findFlightByDetailsAndPassportNative(number, date, passport);

        FlightDisplayDto result =
            flightService.findFlightByDetailsAndPassportNative(number, date, passport);

        assertNotNull(result);
        verify(flightRepository, times(1))
            .findFlightByDetailsAndPassportNative(number, date, passport);
    }

    @Test
    void findFlightByDetailsAndPassportNative_notFound() {
        when(flightRepository.findFlightByDetailsAndPassportNative(any(), any(), any()))
            .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> flightService.findFlightByDetailsAndPassportNative("SU1", LocalDate.now(), "P1")
        );
    }

    @Test
    void getFlightById_success() {
        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(flightMapper.toDisplayDTO(flight)).thenReturn(displayDto);

        FlightDisplayDto result = flightService.getFlightById(1L);

        assertNotNull(result);
    }

    @Test
    void getFlightById_notFound() {
        when(flightRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> flightService.getFlightById(1L));
    }

    @Test
    void updateFlight_success_andInvalidateCache() {
        Flight updated = new Flight();

        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(flightMapper.toEntity(createDto)).thenReturn(updated);
        when(flightRepository.save(updated)).thenReturn(updated);
        when(flightMapper.toDisplayDTO(updated)).thenReturn(displayDto);

        FlightDisplayDto result = flightService.updateFlight(1L, createDto);

        assertEquals(1L, updated.getId());
        assertNotNull(result);
    }

    @Test
    void updateFlight_notFound() {
        when(flightRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> flightService.updateFlight(1L, createDto));
    }

    @Test
    void deleteFlight_success_andInvalidateCache() {
        when(flightRepository.existsById(1L)).thenReturn(true);

        flightService.deleteFlight(1L);

        verify(flightRepository).deleteById(1L);
    }

    @Test
    void deleteFlight_notFound() {
        when(flightRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
            () -> flightService.deleteFlight(1L));

        verify(flightRepository, never()).deleteById(any());
    }
}